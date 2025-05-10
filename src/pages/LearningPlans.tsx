import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

interface LearningPlan {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  userId: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  token: string;
}

const LearningPlan: React.FC = () => {
  const { user } = useAuth() as { user: User | null };
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState({ title: '', description: '' });
  const [editingPlan, setEditingPlan] = useState<LearningPlan | null>(null);

  useEffect(() => {
    fetchPlans();
  }, [user]);

  const fetchPlans = async () => {
    if (!user || !user.token) {
      setError('Please log in to view learning plans.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:8080/api/learning-plans', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPlans(response.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch learning plans.');
      setLoading(false);
    }
  };

  const createPlan = async () => {
    if (!user || !newPlan.title || !newPlan.description) {
      setError('Title and description are required.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/learning-plans',
        { ...newPlan, userId: user.id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setPlans([...plans, response.data]);
      setNewPlan({ title: '', description: '' });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create learning plan.');
    }
  };

  const updatePlan = async () => {
    if (!user || !editingPlan) return;

    try {
      const response = await axios.put(
        `http://localhost:8080/api/learning-plans/${editingPlan.id}`,
        editingPlan,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setPlans(plans.map((plan) => (plan.id === editingPlan.id ? response.data : plan)));
      setEditingPlan(null);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update learning plan.');
    }
  };

  const deletePlan = async (id: string) => {
    if (!user) return;

    try {
      const storedUser = localStorage.getItem('user');
      console.log(storedUser);
      await axios.delete(`http://localhost:8080/api/learning-plans/${storedUser}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPlans(plans.filter((plan) => plan.id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete learning plan.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">Please log in to manage learning plans.</p>
          <Link to="/login" className="inline-block">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-20 md:pb-8 animate-fade-in max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Manage Learning Plans</h1>

      {/* Create Plan Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Learning Plan</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Plan Title"
            value={newPlan.title}
            onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
          <textarea
            placeholder="Plan Description"
            value={newPlan.description}
            onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
            className="w-full p-2 border rounded-md h-32"
          />
          <Button onClick={createPlan} icon={<Plus className="h-4 w-4" />}>
            Create Plan
          </Button>
        </div>
      </div>

      {/* Edit Plan Form */}
      {editingPlan && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit Learning Plan</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={editingPlan.title}
              onChange={(e) => setEditingPlan({ ...editingPlan, title: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
            <textarea
              value={editingPlan.description}
              onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
              className="w-full p-2 border rounded-md h-32"
            />
            <div className="flex space-x-2">
              <Button onClick={updatePlan}>Save Changes</Button>
              <Button variant="outline" onClick={() => setEditingPlan(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Plans List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Learning Plans</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {plans.length === 0 ? (
          <p className="text-gray-500">No learning plans yet.</p>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="border-b pb-4">
                <h3 className="font-medium">{plan.title}</h3>
                <p className="text-gray-600">{plan.description}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(plan.createdAt).toLocaleDateString()}
                </p>
                <div className="flex space-x-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Edit className="h-4 w-4" />}
                    onClick={() => setEditingPlan(plan)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={() => deletePlan(plan.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPlan;