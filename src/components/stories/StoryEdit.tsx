import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getStories, updateStory, Story } from '../../services/storyService';
import { uploadImage } from '../../utils/imageKit';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Upload, X as LucideX, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const StoryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    console.log('StoryEdit: useEffect triggered', { id, user });
    if (!user) {
      console.log('StoryEdit: No user, redirecting to /login');
      navigate('/login');
      return;
    }
    if (!id) {
      console.log('StoryEdit: No story ID, setting error');
      setFormError('Invalid story ID');
      setLoading(false);
      return;
    }

    const fetchStory = async () => {
      try {
        console.log('StoryEdit: Fetching stories');
        const stories = await getStories();
        console.log('StoryEdit: Stories fetched', stories);
        const story = stories.find(s => s.id === id);
        if (story && story.userId === user.id) {
          console.log('StoryEdit: Story found', story);
          setContent(story.content);
          setImagePreview(story.imageUrl);
        } else {
          console.log('StoryEdit: Story not found or unauthorized', { story, userId: user.id });
          setFormError('Story not found or you are not authorized to edit this story');
        }
      } catch (err) {
        console.error('StoryEdit: Error fetching story:', err);
        setFormError('Failed to load story. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id, user, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setImageError('File must be an image');
      return;
    }

    setImageFile(file);
    setImageError(null);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    if (!user || !id) {
      console.log('StoryEdit: No user or ID, redirecting to /login');
      navigate('/login');
      return;
    }
  
    if (!content.trim()) {
      setFormError('Content is required');
      return;
    }
  
    setIsSubmitting(true);
    setFormError(null);
  
    try {
      console.log('StoryEdit: Updating story', { content, imageFile, imagePreview });
      let imageUrl = imagePreview || '';
      if (imageFile) {
        try {
          const uploaded = await uploadImage(imageFile);
          imageUrl = uploaded.url;
        } catch (err) {
          console.error('StoryEdit: Image upload failed:', err);
          imageUrl = imagePreview || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg';
        }
      }
  
      if (!imageUrl) {
        setFormError('An image is required');
        return;
      }
  
      // Fetch the existing story to get userId and username
      const stories = await getStories();
      const story = stories.find(s => s.id === id);
      if (!story) {
        setFormError('Story not found');
        return;
      }
  
      const updatedStory: Story = {
        id: story.id,
        content,
        imageUrl,
        userId: story.userId, // Use existing story's userId
        username: story.username, // Use existing story's username
        createdAt: story.createdAt,
        expiresAt: story.expiresAt,
        viewedBy: story.viewedBy,
      };
  
      await updateStory(id, updatedStory);
      console.log('StoryEdit: Story updated, navigating to /story/${id}');
      navigate(`/story/${id}`);
    } catch (err: any) {
      console.error('StoryEdit: Error updating story:', err);
      setFormError(err.response?.data?.message || 'Failed to update story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="large" /></div>;
  if (formError && !content) return (
    <div className="p-4">
      <div className="text-red-500 mb-4">{formError}</div>
      <Link to={`/story/${id}`} className="text-blue-500 hover:underline">Return to Story</Link>
    </div>
  );

  return (
    <div className="pt-4 pb-20 md:pb-8">
      <div className="flex items-center mb-6">
        <Link to={`/story/${id}`} className="flex items-center text-gray-700">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Cancel</span>
        </Link>
        <h1 className="text-xl font-semibold text-center flex-1">Edit Story</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Story Image</label>
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center ${
              imageError ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Story preview"
                  className="max-h-64 mx-auto rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <LucideX className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div
                className="py-8 flex flex-col items-center cursor-pointer"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500">Click to upload an image</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 5MB</p>
              </div>
            )}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          {imageError && <p className="mt-1 text-sm text-red-600">{imageError}</p>}
        </div>

        {/* Content Field */}
        <div className="mb-6">
          <Input
            label="Story Content"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            error={formError && !content.trim() ? 'Content is required' : undefined}
          />
        </div>

        {/* Error */}
        {formError && (
          <p className="text-sm text-red-600 mb-4">{formError}</p>
        )}

        {/* Submit */}
        <Button
          onClick={handleUpdate}
          fullWidth
          isLoading={isSubmitting}
        >
          Update Story
        </Button>
      </div>
    </div>
  );
};

export default StoryEdit;