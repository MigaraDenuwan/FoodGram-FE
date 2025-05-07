import axios from 'axios';

const API_URL = 'http://localhost:8080/api/stories';

export interface Story {
  id: string;
  content: string;
  imageUrl: string;
  userId: string;
  username: string;
  createdAt: string;
  expiresAt: string;
  viewedBy: string[];
}

export interface CreateStoryRequest {
  content: string;
  imageUrl: string;
  userId: string; // Added userId
  username: string;
  createdAt: string;
  expiresAt: string;
  viewedBy: string[];
}

export async function getStories(): Promise<Story[]> {
  try {
    const response = await axios.get(API_URL, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching stories:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch stories');
  }
}

export async function createStory(data: CreateStoryRequest): Promise<Story> {
  try {
    const response = await axios.post(API_URL, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating story:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to create story');
  }
}

export async function updateStory(id: string, data: Story): Promise<Story> {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating story:', error.response?.data, error.response?.status);
    throw new Error(error.response?.data?.message || 'Failed to update story');
  }
}

export async function deleteStory(id: string): Promise<void> {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true,
    });
  } catch (error: any) {
    console.error('Error deleting story:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete story');
  }
}

export async function viewStory(id: string, viewerId: string): Promise<void> {
  try {
    await axios.patch(`${API_URL}/${id}/view`, { viewerId }, {
      withCredentials: true,
    });
  } catch (error: any) {
    console.error('Error marking story as viewed:', error);
    throw new Error(error.response?.data?.message || 'Failed to mark story as viewed');
  }
}