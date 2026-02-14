import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const callbackUrl = searchParams.get('callbackUrl') || '/';

        // X (Twitter) OAuth 2.0 PKCE flow
        // Docs: https://developer.twitter.com/en/docs/authentication/oauth-2-0/authorization-code

        const xAuthUrl = new URL('https://twitter.com/i/oauth2/authorize');
        xAuthUrl.searchParams.set('client_id', process.env.X_CLIENT_ID || 'YOUR_X_CLIENT_ID');
        xAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/x/callback`);
        xAuthUrl.searchParams.set('response_type', 'code');
        xAuthUrl.searchParams.set('scope', 'tweet.read users.read offline.access');
        xAuthUrl.searchParams.set('state', callbackUrl);
        xAuthUrl.searchParams.set('code_challenge', 'challenge'); // Generate PKCE challenge in production
        xAuthUrl.searchParams.set('code_challenge_method', 'S256');

        // For development/demo
        if (process.env.NODE_ENV !== 'production') {
            console.log('🔐 X (Twitter) Auth initiated');
            console.log('🐦 Would redirect to:', xAuthUrl.toString());

            const response = NextResponse.redirect(new URL(callbackUrl, request.url));

            response.cookies.set('velo-session', 'demo-x-session-token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
            });

            return response;
        }

        return NextResponse.redirect(xAuthUrl.toString());

    } catch (error) {
        console.error('X auth error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}
