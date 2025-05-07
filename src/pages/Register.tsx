import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Utensils } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Username is required')
      .min(3, 'Username must be at least 3 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const { register: registerUser, error, clearError } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });
  
  const onSubmit = async (data: RegisterFormValues) => {
    setIsRegistering(true);
    clearError();
    try {
      await registerUser(data.username, data.email, data.password);
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <Utensils className="h-10 w-10 text-accent-500" />
            <span className="font-serif text-3xl font-semibold ml-2 text-accent-800">
              FoodGram
            </span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6">
          Create your account
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Username"
            type="text"
            placeholder="foodlover"
            icon={<User className="h-5 w-5 text-gray-400" />}
            error={errors.username?.message}
            {...register('username')}
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            error={errors.email?.message}
            {...register('email')}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-5 w-5 text-gray-400" />}
            error={errors.password?.message}
            {...register('password')}
          />
          
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-5 w-5 text-gray-400" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          
          <Button
            type="submit"
            fullWidth
            isLoading={isRegistering}
            className="mt-6"
          >
            Sign Up
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-accent-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;