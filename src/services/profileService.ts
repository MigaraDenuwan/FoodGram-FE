import axios from 'axios';

const API_URL = 'http://localhost:8080/api/profiles';

export interface Profile {
  id: string;
  userId: string;
  name: string;
  bio: string;
  avatarUrl: string;
  followers: number;
  following: number;
  recipeCount: number;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  followers?: number;
  following?: number;
  recipeCount?: number;
}

export async function getProfile(userId: string): Promise<Profile> {
  const response = await axios.get(`${API_URL}/by-userid/${userId}`, {
    withCredentials: true,
  });
  const data = response.data;
  return {
    id: data.id,
    userId: data.username,
    name: data.fullName,
    bio: data.bio || '',
    avatarUrl: data.profilePictureUrl || '',
    followers: data.followers || 0,
    following: data.following || 0,
    recipeCount: data.recipeCount || 0,
  };
}

export async function createProfile(userId: string, data: UpdateProfileRequest): Promise<Profile> {
  const response = await axios.post(
    API_URL,
    {
      username: userId,
      fullName: data.name,
      bio: data.bio,
      profilePictureUrl: data.avatarUrl,
      followers: data.followers || 0,
      following: data.following || 0,
      recipeCount: data.recipeCount || 0,
    },
    { withCredentials: true }
  );
  const dataResponse = response.data;
  return {
    id: dataResponse.id,
    userId: dataResponse.username,
    name: dataResponse.fullName,
    bio: dataResponse.bio || '',
    avatarUrl: dataResponse.profilePictureUrl || '',
    followers: dataResponse.followers || 0,
    following: dataResponse.following || 0,
    recipeCount: dataResponse.recipeCount || 0,
  };
}

export async function updateProfile(userId: string, data: UpdateProfileRequest): Promise<Profile> {
  const response = await axios.put(
    `${API_URL}/${userId}`,
    {
      fullName: data.name,
      bio: data.bio,
      profilePictureUrl: data.avatarUrl,
      followers: data.followers || 0,
      following: data.following || 0,
      recipeCount: data.recipeCount || 0,
    },
    { withCredentials: true }
  );
  const dataResponse = response.data;
  return {
    id: dataResponse.id,
    userId: dataResponse.username,
    name: dataResponse.fullName,
    bio: dataResponse.bio || '',
    avatarUrl: dataResponse.profilePictureUrl || '',
    followers: dataResponse.followers || 0,
    following: dataResponse.following || 0,
    recipeCount: dataResponse.recipeCount || 0,
  };
}

export async function deleteProfile(userId: string): Promise<void> {
  await axios.delete(`${API_URL}/${userId}`, {
    withCredentials: true,
  });
}