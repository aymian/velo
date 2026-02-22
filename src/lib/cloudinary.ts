import axios from 'axios';
import { CLOUDINARY_CONFIG } from './cloudinary-config';
import { auth } from './firebase/config';

export async function uploadToCloudinary(
    file: File | Blob,
    onProgress?: (progress: number) => void,
    isSigned: boolean = false
): Promise<string> {
    const { cloudName, uploadPreset } = CLOUDINARY_CONFIG;

    if (!cloudName) {
        throw new Error("Cloudinary Cloud Name is not configured.");
    }

    const formData = new FormData();
    formData.append('file', file);

    if (isSigned) {
        // --- Signed Upload Workflow (Premium) ---
        const user = auth.currentUser;
        if (!user) throw new Error("Auth required for signed upload");

        const idToken = await user.getIdToken();
        const timestamp = Math.round(new Date().getTime() / 1000).toString();

        // Params that need to be signed
        const paramsToSign = {
            timestamp,
            // Add any other params here (e.g., folder, public_id)
        };

        // Fetch signature from our API
        const { data: { signature } } = await axios.post('/api/cloudinary/sign', {
            paramsToSign
        }, {
            headers: { Authorization: `Bearer ${idToken}` }
        });

        formData.append('signature', signature);
        formData.append('timestamp', timestamp);
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    } else {
        // --- Unsigned Upload Workflow (Standard) ---
        formData.append('upload_preset', uploadPreset);
    }

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
            formData,
            {
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(percentCompleted);
                    }
                }
            }
        );

        return response.data.secure_url;
    } catch (error: any) {
        console.error("Cloudinary Upload Error:", error.response?.data || error.message);
        throw error;
    }
}
