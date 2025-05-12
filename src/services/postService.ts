import axios from 'axios';

const API_URL = 'http://localhost:8080/api/posts';

export interface Post {
  image: any;
  profilePictureUrl: string;
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  userId: string;
  username: string;
  createdAt: string;
  likes: number;
  ingredients: string[];
  steps: string[];
  tags: string[];
  cookTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CreatePostRequest {
  title: string;
  content: string;
  imageUrl: string;
  userId: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
  cookTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export async function getPosts(_token: any): Promise<Post[]> {
  const response = await axios.get(API_URL, {
    withCredentials: true,
  });
  return response.data;
}

export async function getPost(id: string): Promise<Post> {
  const response = await axios.get(`${API_URL}/${id}`, {
    withCredentials: true,
  });
  return response.data;
}

export async function createPost(data: CreatePostRequest): Promise<Post> {
  const response = await axios.post(API_URL, data, {
    withCredentials: true,
  });
  return response.data;
}

export async function updatePost(id: string, data: Partial<Post>): Promise<Post> {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    withCredentials: true,
  });
  return response.data;
}

export async function deletePost(id: string): Promise<void> {
  await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });
}