import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const callbackUrl = searchParams.get('callbackUrl') || '/';

        // Apple Sign In
        // Docs: https://developer.apple.com/documentation/sign_in_with_apple

        const appleAuthUrl = new URL('https://appleid.apple.com/auth/authorize');
        appleAuthUrl.searchParams.set('client_id', process.env.APPLE_CLIENT_ID || 'YOUR_APPLE_CLIENT_ID');
        appleAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/apple/callback`);
        appleAuthUrl.searchParams.set('response_type', 'code id_token');
        appleAuthUrl.searchParams.set('response_mode', 'form_post');
        appleAuthUrl.searchParams.set('scope', 'name email');
        appleAuthUrl.searchParams.set('state', callbackUrl);

        // For development/demo
        if (process.env.NODE_ENV !== 'production') {
            console.log('🔐 Apple Sign In initiated');
            console.log('🍎 Would redirect to:', appleAuthUrl.toString());

            const response = NextResponse.redirect(new URL(callbackUrl, request.url));

            response.cookies.set('velo-session', 'demo-apple-session-token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
            });

            return response;
        }

        return NextResponse.redirect(appleAuthUrl.toString());

    } catch (error) {
        console.error('Apple auth error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    // Apple uses POST for callback
    try {
        const formData = await request.formData();
        const code = formData.get('code');
        const idToken = formData.get('id_token');
        const state = formData.get('state') || '/';

        // Verify Apple ID token
        // Create/update user
        // Create session

        const response = NextResponse.redirect(new URL(state as string, request.url));

        response.cookies.set('velo-session', 'apple-session-token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;

    } catch (error) {
        console.error('Apple callback error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}
