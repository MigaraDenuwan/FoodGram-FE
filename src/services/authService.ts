import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  username: string;
  email: string;
}

// Configure axios defaults
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export async function loginUser(data: LoginRequest): Promise<UserResponse> {
  try {
    const response = await axiosInstance.post('/login', data);
    if (response.data.message?.includes('successful')) {
      return {
        id: 'user-' + Date.now(),
        username: response.data.username,
        email: response.data.email
      };
    }
    throw new Error(response.data.error || 'Login failed');
  } catch (error: any) {
    console.error('Full login error:', error);
    if (error.response?.status === 401) {
      throw new Error('Invalid credentials. Please check your email and password.');
    }
    if (error.response?.status === 403) {
      throw new Error('Access denied. Please check your credentials or server configuration.');
    }
    throw new Error(error.response?.data?.error || error.message || 'Login failed. Please try again.');
  }
}

export async function registerUser(data: RegisterRequest): Promise<string> {
  try {
    const response = await axiosInstance.post('/register', data);
    return response.data.message || 'Registration successful';
  } catch (error: any) {
    console.error('Full register error:', error);
    if (error.response?.status === 403) {
      throw new Error('Registration failed. Email might already be in use.');
    }
    throw new Error(error.response?.data?.error || error.message || 'Registration failed. Please try again.');
  }
}

export async function logoutUser(): Promise<string> {
  try {
    const response = await axiosInstance.post('/logout', {});
    return response.data.message || 'Logged out successfully';
  } catch (error: any) {
    console.error('Full logout error:', error);
    throw new Error(error.response?.data?.error || error.message || 'Logout failed. Please try again.');
  }
}

export async function getImagekitAuth(): Promise<{
  token: string;
  expire: string;
  signature: string;
}> {
  try {
    const response = await axiosInstance.get('/imagekit');
    return response.data;
  } catch (error: any) {
    console.error('Full imagekit auth error:', error);
    throw new Error(error.response?.data?.error || error.message || 'Failed to get ImageKit authentication.');
  }
}