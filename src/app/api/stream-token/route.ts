import { NextRequest, NextResponse } from "next/server";
import { StreamClient } from "@stream-io/node-sdk";
import { STREAM_CONFIG } from "@/lib/stream/config";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();
        if (!userId) {
            return NextResponse.json({ error: "userId required" }, { status: 400 });
        }

        const client = new StreamClient(STREAM_CONFIG.apiKey, STREAM_CONFIG.apiSecret);
        const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
        const issuedAt = Math.floor(Date.now() / 1000) - 60;

        const token = client.generateUserToken({
            user_id: userId,
            exp: expirationTime,
            iat: issuedAt,
        });

        return NextResponse.json({ token });
    } catch (err: any) {
        console.error("Stream token error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
