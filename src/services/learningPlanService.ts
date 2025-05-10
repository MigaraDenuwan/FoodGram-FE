import axios from 'axios';

const API_URL = 'http://localhost:8080/api/learning-plans';

export interface LearningPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  goals: string;
  createdAt: string;
  updatedAt: string;
}

export const getLearningPlans = async (token: string): Promise<LearningPlan[]> => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createLearningPlan = async (plan: Omit<LearningPlan, 'id' | 'createdAt' | 'updatedAt'>, token: string): Promise<LearningPlan> => {
  const response = await axios.post(API_URL, plan, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateLearningPlan = async (id: string, updates: Partial<LearningPlan>, token: string): Promise<LearningPlan> => {
  const response = await axios.put(`${API_URL}/${id}`, updates, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteLearningPlan = async (id: string, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};