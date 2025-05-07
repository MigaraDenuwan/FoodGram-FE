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
  userId: string;
}

export async function getStories(): Promise<Story[]> {
  const response = await axios.get(API_URL, {
    withCredentials: true,
  });
  return response.data;
}

export async function createStory(data: CreateStoryRequest): Promise<Story> {
  const response = await axios.post(API_URL, data, {
    withCredentials: true,
  });
  return response.data;
}

export async function updateStory(id: string, data: Partial<Story>): Promise<Story> {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    withCredentials: true,
  });
  return response.data;
}

export async function deleteStory(id: string): Promise<void> {
  await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });
}

export async function viewStory(id: string, viewerId: string): Promise<void> {
  await axios.patch(`${API_URL}/${id}/view`, { viewerId }, {
    withCredentials: true,
  });
}