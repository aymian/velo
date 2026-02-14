import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { credential, challenge } = body;

        // WebAuthn/Passkey Registration Flow:
        // 1. Client generates credential using navigator.credentials.create()
        // 2. Server verifies the credential
        // 3. Store public key in database
        // 4. Associate with user account

        if (!credential) {
            return NextResponse.json(
                { error: 'Credential required' },
                { status: 400 }
            );
        }

        // For development/demo
        const isDevelopment = process.env.NODE_ENV !== 'production';

        if (isDevelopment) {
            console.log('🔐 Passkey Registration initiated');
            console.log('🔑 Credential ID:', credential.id);

            const response = NextResponse.json({
                success: true,
                message: 'Passkey registered successfully',
                credentialId: credential.id
            });

            return response;
        }

        // Production: Verify WebAuthn credential
        // const verified = await verifyRegistrationResponse({
        //     credential,
        //     expectedChallenge: challenge,
        //     expectedOrigin: process.env.NEXT_PUBLIC_APP_URL,
        // });

        return NextResponse.json({
            success: true,
            message: 'Passkey registered successfully'
        });

    } catch (error) {
        console.error('Passkey registration error:', error);
        return NextResponse.json(
            { error: 'Passkey registration failed' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    // Passkey Authentication (Login)
    try {
        const body = await request.json();
        const { credential, challenge } = body;

        if (!credential) {
            return NextResponse.json(
                { error: 'Credential required' },
                { status: 400 }
            );
        }

        // For development/demo
        const isDevelopment = process.env.NODE_ENV !== 'production';

        if (isDevelopment) {
            console.log('🔐 Passkey Authentication initiated');
            console.log('🔑 Credential ID:', credential.id);

            const response = NextResponse.json({
                success: true,
                message: 'Authenticated successfully'
            });

            response.cookies.set('velo-session', 'demo-passkey-session-token', {
                httpOnly: true,
                secure: !isDevelopment,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
            });

            return response;
        }

        // Production: Verify WebAuthn assertion
        // const user = await getUserByCredentialId(credential.id);
        // const verified = await verifyAuthenticationResponse({
        //     credential,
        //     expectedChallenge: challenge,
        //     expectedOrigin: process.env.NEXT_PUBLIC_APP_URL,
        //     authenticator: user.authenticator,
        // });

        return NextResponse.json({
            success: true,
            message: 'Authenticated successfully'
        });

    } catch (error) {
        console.error('Passkey authentication error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 401 }
        );
    }
}

export async function GET(request: NextRequest) {
    // Get registration/authentication options
    try {
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type'); // 'register' or 'authenticate'

        // Generate challenge for WebAuthn
        const challenge = generateChallenge();

        if (type === 'register') {
            // Registration options
            const options = {
                challenge,
                rp: {
                    name: 'Velo',
                    id: process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost',
                },
                user: {
                    id: generateUserId(),
                    name: 'user@example.com', // Get from session
                    displayName: 'Velo User',
                },
                pubKeyCredParams: [
                    { alg: -7, type: 'public-key' },  // ES256
                    { alg: -257, type: 'public-key' }, // RS256
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
            // Authentication options
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
    // In production, use crypto.randomBytes or Web Crypto API
    return Buffer.from(Math.random().toString()).toString('base64url');
}

function generateUserId(): string {
    // In production, use actual user ID from database
    return Buffer.from(Math.random().toString()).toString('base64url');
}
