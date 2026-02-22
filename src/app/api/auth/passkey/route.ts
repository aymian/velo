import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        console.log('📝 Passkey registration request received');
        const body = await request.json();
        const { credential, challenge, pin } = body;

        if (!credential || !credential.id) {
            console.error('❌ Missing credential ID in registration');
            return NextResponse.json(
                { error: 'Credential ID required' },
                { status: 400 }
            );
        }

        const adminDb = getAdminDb();
        if (!adminDb) {
            throw new Error('Database connection failed');
        }

        // 1. Create a dynamic user for this passkey
        // Use a consistent ID format
        const userId = `pk_${credential.id.slice(0, 15).replace(/[^a-zA-Z0-9]/g, '_')}`;
        const email = `user_${credential.id.slice(0, 8)}@velo.live`;

        const userData = {
            uid: userId,
            email: email,
            displayName: 'Velo Explorer',
            photoURL: `https://ui-avatars.com/api/?name=User&background=ff4081&color=fff`,
            passkeyId: credential.id,
            pin: pin || null,
            providers: ['passkey'],
            createdAt: new Date(),
            updatedAt: new Date(),
            username: `velo_${Math.floor(Math.random() * 10000)}`
        };

        // 2. Save to Firestore
        await adminDb.collection(COLLECTIONS.USERS).doc(userId).set(userData);

        console.log('✅ Passkey Registered in Firestore. User ID:', userId, 'Passkey ID:', credential.id);

        const response = NextResponse.json({
            success: true,
            message: 'Passkey registered successfully',
            user: userData
        });

        // 3. Set Session Cookie (JSON string)
        response.cookies.set('velo-session', JSON.stringify({
            provider: 'passkey',
            user: {
                id: userId,
                email: email,
                name: userData.displayName,
                picture: userData.photoURL
            }
        }), {
            httpOnly: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('❌ Passkey registration error:', error.message);
        return NextResponse.json(
            { error: `Registration failed: ${error.message}` },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    // Passkey Authentication (Login)
    try {
        const body = await request.json();
        const { credential } = body;

        console.log('🔍 Passkey Login Attempt. Looking for ID:', credential?.id);

        if (!credential || !credential.id) {
            return NextResponse.json(
                { error: 'Credential ID required' },
                { status: 400 }
            );
        }

        // 1. Find user in Firestore by passkeyId
        const adminDb = getAdminDb();
        if (!adminDb) {
            throw new Error('Database connection failed');
        }

        const usersRef = adminDb.collection(COLLECTIONS.USERS);
        const snapshot = await usersRef.where('passkeyId', '==', String(credential.id)).limit(1).get();

        if (snapshot.empty) {
            console.error('❌ Passkey not found in Firestore. Searched for:', credential.id);
            // List some IDs to see if there's a mismatch
            return NextResponse.json(
                { error: 'Passkey not recognized. Please register first.' },
                { status: 401 }
            );
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        console.log('✅ User Found via Passkey:', userData.email);

        const response = NextResponse.json({
            success: true,
            message: 'Authenticated successfully',
            user: userData
        });

        // 2. Set Session Cookie
        response.cookies.set('velo-session', JSON.stringify({
            provider: 'passkey',
            user: {
                id: userData.uid,
                email: userData.email,
                name: userData.displayName || 'Passkey User',
                picture: userData.photoURL
            }
        }), {
            httpOnly: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('❌ Passkey authentication error:', error.message);
        return NextResponse.json(
            { error: `Authentication error: ${error.message}` },
            { status: 401 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type');

        const challenge = generateChallenge();

        if (type === 'register') {
            const options = {
                challenge,
                rp: {
                    name: 'Velo',
                    id: process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost',
                },
                user: {
                    id: generateUserId(),
                    name: 'user@velo.live',
                    displayName: 'Velo User',
                },
                pubKeyCredParams: [
                    { alg: -7, type: 'public-key' },
                    { alg: -257, type: 'public-key' },
                ],
                timeout: 60000,
                attestation: 'none',
                authenticatorSelection: {
                    authenticatorAttachment: 'platform',
                    requireResidentKey: false,
                    userVerification: 'preferred',
                },
            };

            return NextResponse.json(options);
        } else {
            const options = {
                challenge,
                timeout: 60000,
                rpId: process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost',
                userVerification: 'preferred',
            };

            return NextResponse.json(options);
        }

    } catch (error) {
        console.error('Passkey options error:', error);
        return NextResponse.json(
            { error: 'Failed to generate options' },
            { status: 500 }
        );
    }
}

function generateChallenge(): string {
    return Buffer.from(Math.random().toString()).toString('base64url');
}

function generateUserId(): string {
    return Buffer.from(Math.random().toString()).toString('base64url');
}
