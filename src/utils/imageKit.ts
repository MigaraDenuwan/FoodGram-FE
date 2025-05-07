import { getImagekitAuth } from '../services/authService';

const IMAGEKIT_URL_ENDPOINT = 'https://upload.imagekit.io/api/v1/files/upload';
const IMAGEKIT_PUBLIC_KEY = 'public_pPSo4kEfBmsTnZsqw24ukoa9xa0=';

export interface UploadResponse {
  url: string;
  fileId: string;
  name: string;
}

export async function uploadImage(file: File): Promise<UploadResponse> {
  try {
    const authParameters = await getImagekitAuth();
    console.log('ImageKit auth parameters:', authParameters);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('publicKey', IMAGEKIT_PUBLIC_KEY);
    formData.append('fileName', file.name);
    formData.append('signature', authParameters.signature);
    formData.append('token', authParameters.token);
    formData.append('expire', authParameters.expire);
    formData.append('folder', '/foodgram');

    console.log('Uploading to:', IMAGEKIT_URL_ENDPOINT);
    const response = await fetch(IMAGEKIT_URL_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ImageKit response:', response.status, errorText);
      throw new Error(`Image upload failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('ImageKit upload success:', data);

    return {
      url: data.url,
      fileId: data.fileId,
      name: data.name,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}