import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const endpoint = process.env.R2_ENDPOINT;

if (!accessKeyId || !secretAccessKey || !endpoint) {
    console.warn("Cloudflare R2 credentials or endpoint are missing in environment variables.");
}

export const r2 = new S3Client({
    region: "auto",
    endpoint: endpoint as string,
    credentials: {
        accessKeyId: accessKeyId as string,
        secretAccessKey: secretAccessKey as string,
    },
});
