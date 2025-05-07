import axios from 'axios';

const API_URL = 'http://localhost:8080/api/comments';

export interface Comment {
  id: string;
  content: string;
  postId: string;
  userId: string;
  username: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
  postId: string;
  userId: string;
}

export async function getComments(postId: string): Promise<Comment[]> {
  const response = await axios.get(`${API_URL}/${postId}`, {
    withCredentials: true,
  });
  return response.data;
}

export async function createComment(data: CreateCommentRequest): Promise<Comment> {
  const response = await axios.post(API_URL, data, {
    withCredentials: true,
  });
  return response.data;
}

export async function updateComment(id: string, content: string): Promise<Comment> {
  const response = await axios.put(`${API_URL}/${id}`, { content }, {
    withCredentials: true,
  });
  return response.data;
}

export async function deleteComment(id: string): Promise<void> {
  await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });
}