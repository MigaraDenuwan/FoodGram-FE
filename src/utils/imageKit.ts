import { getImagekitAuth } from '../services/authService';

const IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/iuqvbuoaa';
const IMAGEKIT_PUBLIC_KEY = 'public_pPSo4kEfBmsTnZsqw24ukoa9xa0='; // Replace with your actual public key

export interface UploadResponse {
  url: string;
  fileId: string;
  name: string;
}

export async function uploadImage(file: File): Promise<UploadResponse> {
  try {
    const authParameters = await getImagekitAuth();
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('publicKey', IMAGEKIT_PUBLIC_KEY);
    formData.append('fileName', file.name);
    formData.append('signature', authParameters.signature);
    formData.append('token', authParameters.token);
    formData.append('expire', authParameters.expire);
    formData.append('folder', '/foodgram');
    
    const response = await fetch(`${IMAGEKIT_URL_ENDPOINT}/api/v1/files/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Image upload failed');
    }
    
    const data = await response.json();
    
    return {
      url: data.url,
      fileId: data.fileId,
      name: data.name
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}