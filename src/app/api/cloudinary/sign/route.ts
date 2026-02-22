import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

// BUILD-TIME EVALUATION GUARD
if (typeof window !== 'undefined') {
    console.warn('⚠️ Cloudinary sign route evaluated in client context');
}

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    try {
        const adminAuth = getAdminAuth();
        const adminDb = getAdminDb();

        if (!adminAuth || !adminDb) {
            throw new Error('Firebase Admin not initialized');
        }

        // 1. Verify User
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // 2. Check Plan Level
        const userDoc = await adminDb.collection('users').doc(uid).get();
        const userData = userDoc.data();
        const plan = userData?.plan || 'free';

        // ONLY Pro and Elite can get signatures for signed uploads
        // Basic can too if you want, but user said "only premium"
        if (plan === 'free') {
            return NextResponse.json({
                error: 'Premium subscription required for advanced uploads.'
            }, { status: 403 });
        }

        const body = await req.json();
        const { paramsToSign } = body;

        // 3. Generate Signature
        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET!
        );

        return NextResponse.json({ signature });
    } catch (error) {
        console.error('Cloudinary Sign Error:', error);
        return NextResponse.json({ error: 'Signature generation failed' }, { status: 500 });
    }
}
