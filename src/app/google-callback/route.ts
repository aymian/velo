import { NextRequest, NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');
        const state = searchParams.get('state') || '/';
        const error = searchParams.get('error');

        // Handle OAuth errors
        if (error) {
            console.error('Google OAuth error:', error);
            return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
        }

        if (!code) {
            return NextResponse.redirect(new URL('/login?error=no_code', request.url));
        }

        // Exchange authorization code for access token
        const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
        const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
            console.error('Missing Google OAuth credentials in environment');
            return NextResponse.redirect(new URL('/login?error=missing_config', request.url));
        }

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: `${APP_URL}/google-callback`,
                grant_type: 'authorization_code',
            }),
        });

        const tokens = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Token exchange error:', tokens);
            return NextResponse.redirect(new URL('/login?error=token_exchange_failed', request.url));
        }

        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });

        const userInfo = await userInfoResponse.json();

        if (!userInfoResponse.ok) {
            console.error('User info error:', userInfo);
            return NextResponse.redirect(new URL('/login?error=user_info_failed', request.url));
        }

        console.log('✅ Google authentication successful:', userInfo.email);

        // Create session and redirect to verifying page
        let targetRedirect = state;
        try {
            const userRef = adminDb.collection(COLLECTIONS.USERS).doc(userInfo.id);
            const userDoc = await userRef.get();

            const userData = {
                uid: userInfo.id,
                email: userInfo.email,
                displayName: userInfo.name,
                photoURL: userInfo.picture,
                updatedAt: new Date(),
                providers: ['google'],
            };

            if (!userDoc.exists) {
                // @ts-ignore
                userData.createdAt = new Date();
                // @ts-ignore
                userData.username = userInfo.email.split('@')[0] + Math.floor(Math.random() * 1000);

                // If new user, force them to onboarding
                targetRedirect = '/onboarding';
            }

            await userRef.set(userData, { merge: true });
        } catch (dbError) {
            console.error('⚠️ Failed to update user in Firestore:', dbError);
            // Continue even if database update fails during local dev
        }

        const verifyingUrl = new URL('/verifying', request.url);
        verifyingUrl.searchParams.set('provider', 'google');
        verifyingUrl.searchParams.set('redirect', targetRedirect);

        const response = NextResponse.redirect(verifyingUrl);

        // Set session cookie with user data
        response.cookies.set('velo-session', JSON.stringify({
            provider: 'google',
            user: {
                id: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
            },
            accessToken: tokens.access_token,
            expiresAt: Date.now() + (tokens.expires_in * 1000),
        }), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Google callback error:', error);
        return NextResponse.redirect(new URL('/login?error=callback_failed', request.url));
    }
}
