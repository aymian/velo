import axios from 'axios';

export async function uploadToCloudinary(
    file: File | Blob,
    onProgress?: (progress: number) => void
): Promise<string> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

    if (!cloudName || cloudName === 'your_cloud_name_here') {
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
