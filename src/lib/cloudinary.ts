import axios from 'axios';
import { CLOUDINARY_CONFIG } from './cloudinary-config';

export async function uploadToCloudinary(
    file: File | Blob,
    onProgress?: (progress: number) => void
): Promise<string> {
    const { cloudName, uploadPreset } = CLOUDINARY_CONFIG;

    if (!cloudName) {
        throw new Error("Cloudinary Cloud Name is not configured.");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, // Use 'auto' to handle both images and videos
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
