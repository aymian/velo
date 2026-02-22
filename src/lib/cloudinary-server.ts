import { v2 as cloudinary } from 'cloudinary';

let cloudinaryConfigured = false;

/**
 * Lazy-initializes Cloudinary to prevent build-time failures
 * occurring when environment variables are unavailable during static analysis.
 */
export const getCloudinaryServer = () => {
    if (cloudinaryConfigured) return cloudinary;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        console.warn('⚠️ Missing Cloudinary credentials. Cloudinary will not be initialized.');
        throw new Error("Missing Cloudinary environment variables");
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });

    cloudinaryConfigured = true;
    return cloudinary;
};
