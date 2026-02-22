import Mux from '@mux/mux-node';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { NextResponse } from 'next/server';

const getMux = () => {
    const tokenId = process.env.MUX_TOKEN_ID;
    const tokenSecret = process.env.MUX_TOKEN_SECRET;
    if (!tokenId || !tokenSecret) {
        throw new Error("Missing Mux environment variables");
    }
    return new Mux({
        tokenId,
        tokenSecret,
    });
};

export async function POST(req: Request) {
    const mux = getMux();
    const body = await req.json();
    const signature = req.headers.get('mux-signature');

    // Verify webhook signature in production
    // try {
    //   mux.webhooks.verifySignature(JSON.stringify(body), signature!, process.env.MUX_WEBHOOK_SECRET!);
    // } catch (e) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const { type, data } = body;

    console.log(`Mux Webhook Received: ${type}`);

    if (type === 'video.asset.ready') {
        const asset = data;
        const playbackId = asset.playback_ids?.[0]?.id;
        const uploadId = asset.upload_id;

        if (uploadId && playbackId) {
            // Find the post with this uploadId and update it
            const q = query(collection(db, COLLECTIONS.POSTS), where('muxUploadId', '==', uploadId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const postDoc = querySnapshot.docs[0];
                await updateDoc(doc(db, COLLECTIONS.POSTS, postDoc.id), {
                    muxPlaybackId: playbackId,
                    muxAssetId: asset.id,
                    status: 'ready'
                });
            }
        }
    }

    return NextResponse.json({ received: true });
}
