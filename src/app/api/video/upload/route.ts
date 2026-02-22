import { getMuxServer } from '@/lib/mux';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const mux = getMuxServer();
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
