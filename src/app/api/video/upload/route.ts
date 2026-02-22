import Mux from '@mux/mux-node';
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
    try {
        const mux = getMux();
        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                playback_policy: ['public'],
                video_quality: 'basic',
            },
            cors_origin: '*', // In production, replace with your domain
        });

        return NextResponse.json({
            id: upload.id,
            url: upload.url,
        });
    } catch (error) {
        console.error('Mux Upload Error:', error);
        return NextResponse.json({ error: 'Failed to create upload URL' }, { status: 500 });
    }
}
