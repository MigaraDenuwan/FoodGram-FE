import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getProfile, createProfile, updateProfile, deleteProfile, Profile } from '../services/profileService';
import { uploadImage } from '../utils/imageKit';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(160, 'Bio must be at most 160 characters').optional(),
  email: z.string().email('Invalid email address'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface User {
  id: string;
  username: string;
  email: string;
  token: string;
}

const EditProfile: React.FC = () => {
  const { user } = useAuth() as { user: User | null };
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      bio: '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    console.log('EditProfile: user=', user);
    if (!user || !user.id || !user.token) {
      setErrorMessage('User not authenticated');
      navigate('/login');
      return;
    }

    async function fetchProfile() {
      try {
        if (!user || typeof user.token !== 'string') {
          throw new Error('Invalid token: token must be a string');
        }
        console.log('EditProfile: Using token=', user.token);
        const profileData = await getProfile(user.id, user.token);
        setProfile(profileData);
        if (profileData) {
          setValue('name', profileData.name);
          setValue('bio', profileData.bio || '');
          setValue('email', profileData.email);
          if (profileData.avatarUrl) {
            setAvatarPreview(profileData.avatarUrl);
          }
        } else {
          setValue('email', user.email);
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
        setErrorMessage('Failed to load profile: ' + error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user, navigate, setValue]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Image must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setAvatarError('File must be an image');
      return;
    }

    setAvatarFile(file);
    setAvatarError(null);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !user.id || !user.token) {
      setErrorMessage('User not authenticated');
      return;
    }

    if (typeof user.token !== 'string') {
      setErrorMessage('Invalid token: token must be a string');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      let avatarUrl = profile?.avatarUrl || '';
      if (avatarFile) {
        const uploadResult = await uploadImage(avatarFile);
        avatarUrl = uploadResult.url;
      }

      const profileData = {
        name: data.name,
        bio: data.bio || '',
        avatarUrl,
        email: data.email,
        followers: profile?.followers || 0,
        following: profile?.following || 0,
        recipeCount: profile?.recipeCount || 0,
      };

      console.log('onSubmit: Sending profileData=', profileData, 'token=', user.token);

      if (profile) {
        await updateProfile(user.id, profileData, user.token);
      } else {
        await createProfile(user.id, profileData, user.token);
      }

      navigate(`/profile/${user.id}`);
    } catch (error: any) {
      console.error('Error saving profile:', error.message);
      setErrorMessage(`Failed to ${profile ? 'update' : 'create'} profile: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!user || !user.id || !user.token) {
      setErrorMessage('User not authenticated');
      return;
    }

    if (typeof user.token !== 'string') {
      setErrorMessage('Invalid token: token must be a string');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await deleteProfile(user.id, user.token);
      navigate('/login');
    } catch (error: any) {
      console.error('Error deleting profile:', error.message);
      setErrorMessage(`Failed to delete profile: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="pt-4 pb-20 md:pb-8">
      <div className="flex items-center mb-6">
        <Link to={`/profile/${user?.id ?? ''}`} className="flex items-center text-gray-700">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back</span>
        </Link>
        <h1 className="text-xl font-semibold text-center flex-1">Edit Profile</h1>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
        <div className="mb-6 flex flex-col items-center">
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Profile Picture
          </label>
          <div className={`relative mb-4`}>
            <div
              className={`w-32 h-32 rounded-full overflow-hidden ${
                !avatarPreview ? 'bg-gray-200' : ''
              }`}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Upload className="h-10 w-10" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => document.getElementById('avatar-upload')?.click()}
              className="absolute bottom-0 right-0 bg-accent-500 text-white rounded-full p-2"
            >
              <Upload className="h-4 w-4" />
            </button>
          </div>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          {avatarError && <p className="text-sm text-red-600 mt-1">{avatarError}</p>}
        </div>

        <div className="space-y-4 mb-6">
          <Input
            label="Name"
            placeholder="Your name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            placeholder="Your email"
            error={errors.email?.message}
            {...register('email')}
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              placeholder="Tell us about yourself..."
              className={`w-full rounded-md border px-3 py-2 ${
                errors.bio ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500`}
              rows={3}
              maxLength={160}
              {...register('bio')}
            />
            {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
          </div>
        </div>

        <div className="mt-8">
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Save Profile
          </Button>
        </div>

        {profile && (
          <div className="mt-4">
            <Button
              variant="danger"
              fullWidth
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSubmitting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Profile
            </Button>
          </div>
        )}
      </form>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Delete Profile</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your profile? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteProfile} isLoading={isSubmitting}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;