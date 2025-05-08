import axios from 'axios';

const API_URL = 'http://localhost:8080/api/profiles';

export interface Profile {
  id: string;
  userId: string;
  name: string;
  bio: string;
  profilePictureUrl: string;
  email: string;
  followers: number;
  following: number;
  recipeCount: number;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  profilePictureUrl?: string;
  email?: string;
  followers?: number;
  following?: number;
  recipeCount?: number;
}

export async function getProfile(userId: string, token: string): Promise<Profile | null> {
  try {
    if (!token) {
      throw new Error('Token is required');
    }
    const response = await axios.get(`${API_URL}/by-userid/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    const data = response.data;
    if (!data) {
      return null; // Return null if no profile exists
    }
    return {
      id: data.id,
      userId: data.userId || userId,
      name: data.fullName || data.username || '', // Map fullName or username to name
      bio: data.bio || '',
      profilePictureUrl: data.profilePictureUrl || '', // Map profilePictureUrl
      email: data.email || '',
      followers: data.followers || 0,
      following: data.following || 0,
      recipeCount: data.recipeCount || 0,
    };
  } catch (error: any) {
    console.error('Error fetching profile:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
}

export async function createProfile(userId: string, data: UpdateProfileRequest, token: string): Promise<Profile> {
  if (!userId) {
    throw new Error('userId is required');
  }
  if (!data.name || !data.email) {
    throw new Error('Name and email are required');
  }
  if (!token) {
    throw new Error('Token is required');
  }

  const payload = {
    userId,
    fullName: data.name, // Map name to fullName
    username: data.name, // Optionally set username
    bio: data.bio || '',
    profilePictureUrl: data.profilePictureUrl || '', // Map profilePictureUrl
    email: data.email,
    followers: data.followers || 0,
    following: data.following || 0,
    recipeCount: data.recipeCount || 0,
  };

  try {
    const response = await axios.post(API_URL, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    const dataResponse = response.data;
    return {
      id: dataResponse.id,
      userId: dataResponse.userId,
      name: dataResponse.fullName || dataResponse.username || '',
      bio: dataResponse.bio || '',
      profilePictureUrl: dataResponse.profilePictureUrl || '',
      email: dataResponse.email,
      followers: dataResponse.followers || 0,
      following: dataResponse.following || 0,
      recipeCount: dataResponse.recipeCount || 0,
    };
  } catch (error: any) {
    console.error('Error creating profile:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to create profile');
  }
}

export async function updateProfile(userId: string, data: UpdateProfileRequest, token: string): Promise<Profile> {
  if (!token) {
    throw new Error('Token is required');
  }
  try {
    const response = await axios.put(
      `${API_URL}/by-userid/${userId}`,
      {
        userId,
        fullName: data.name, // Map name to fullName
        username: data.name, // Optionally set username
        bio: data.bio || '',
        profilePictureUrl: data.profilePictureUrl || '', // Map profilePictureUrl
        email: data.email,
        followers: data.followers || 0,
        following: data.following || 0,
        recipeCount: data.recipeCount || 0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    const dataResponse = response.data;
    return {
      id: dataResponse.id,
      userId: dataResponse.userId,
      name: dataResponse.fullName || dataResponse.username || '',
      bio: dataResponse.bio || '',
      profilePictureUrl: dataResponse.profilePictureUrl || '',
      email: dataResponse.email,
      followers: dataResponse.followers || 0,
      following: dataResponse.following || 0,
      recipeCount: dataResponse.recipeCount || 0,
    };
  } catch (error: any) {
    console.error('Error updating profile:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
}

export async function deleteProfile(userId: string, token: string): Promise<void> {
  if (!token) {
    throw new Error('Token is required');
  }
  try {
    await axios.delete(`${API_URL}/by-userid/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  } catch (error: any) {
    console.error('Error deleting profile:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete profile');
  }
}