import axios from 'axios';

const API_URL = 'http://localhost:8080/api/profiles';

export interface Profile {
  id: string;
  userId: string;
  name: string;
  bio: string;
  avatarUrl: string;
  email: string;
  followers: number;
  following: number;
  recipeCount: number;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
  followers?: number;
  following?: number;
  recipeCount?: number;
}

export async function getProfile(userId: string, token?: string): Promise<Profile | null> {
  try {
    const response = await axios.get(`${API_URL}/by-userid/${userId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      withCredentials: true,
    });
    const data = response.data;
    return {
      id: data.id,
      userId: data.username,
      name: data.fullName,
      bio: data.bio || '',
      avatarUrl: data.profilePictureUrl || '',
      email: data.email || '',
      followers: data.followers || 0,
      following: data.following || 0,
      recipeCount: data.recipeCount || 0,
    };
  } catch (error: any) {
    console.error('Error fetching profile:', error.response?.status, error.response?.data);
    return null;
  }
}

export async function createProfile(userId: string, data: UpdateProfileRequest, token?: string): Promise<Profile> {
  const response = await axios.post(
    API_URL,
    {
      username: userId,
      fullName: data.name,
      bio: data.bio,
      profilePictureUrl: data.avatarUrl,
      email: data.email,
      followers: data.followers || 0,
      following: data.following || 0,
      recipeCount: data.recipeCount || 0,
    },
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      withCredentials: true,
    }
  );
  const dataResponse = response.data;
  return {
    id: dataResponse.id,
    userId: dataResponse.username,
    name: dataResponse.fullName,
    bio: dataResponse.bio || '',
    avatarUrl: dataResponse.profilePictureUrl || '',
    email: dataResponse.email || '',
    followers: dataResponse.followers || 0,
    following: dataResponse.following || 0,
    recipeCount: dataResponse.recipeCount || 0,
  };
}

export async function updateProfile(userId: string, data: UpdateProfileRequest, token?: string): Promise<Profile> {
  const response = await axios.put(
    `${API_URL}/${userId}`,
    {
      fullName: data.name,
      bio: data.bio,
      profilePictureUrl: data.avatarUrl,
      email: data.email,
      followers: data.followers || 0,
      following: data.following || 0,
      recipeCount: data.recipeCount || 0,
    },
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      withCredentials: true,
    }
  );
  const dataResponse = response.data;
  return {
    id: dataResponse.id,
    userId: dataResponse.username,
    name: dataResponse.fullName,
    bio: dataResponse.bio || '',
    avatarUrl: dataResponse.profilePictureUrl || '',
    email: dataResponse.email || '',
    followers: dataResponse.followers || 0,
    following: dataResponse.following || 0,
    recipeCount: dataResponse.recipeCount || 0,
  };
}

export async function deleteProfile(userId: string, token?: string): Promise<void> {
  await axios.delete(`${API_URL}/${userId}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },    
    withCredentials: true,
  });
}