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
    let user: UserResponse;

    if (typeof response.data === 'string') {
      if (response.data.includes('successful')) {
        user = {
          id: 'user-' + Date.now(),
          username: data.email.split('@')[0],
          email: data.email
        };
      } else {
        throw new Error(response.data);
      }
    } else {
      user = response.data;
    }

    localStorage.setItem('user', JSON.stringify(user));

    return user;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('Access denied. Please check your credentials.');
    }
    throw new Error(error.response?.data || error.message || 'Login failed. Please try again.');
  }
}


export async function registerUser(data: RegisterRequest): Promise<string> {
  try {
    const response = await axiosInstance.post('/register', data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('Registration failed. Email might already be in use.');
    }
    throw new Error(error.response?.data || error.message || 'Registration failed. Please try again.');
  }
}

export async function logoutUser(): Promise<string> {
  try {
    const response = await axiosInstance.post('/logout', {});
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message || 'Logout failed. Please try again.');
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
    throw new Error(error.response?.data || error.message || 'Failed to get ImageKit authentication.');
  }
}