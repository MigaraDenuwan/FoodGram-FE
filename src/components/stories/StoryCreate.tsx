import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X as LucideX, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createStory } from '../../services/storyService';
import { uploadImage } from '../../utils/imageKit'; // same as in recipe form
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Link } from 'react-router-dom';

const StoryCreate: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  const handleCreate = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!content.trim() || !imageFile) {
      setFormError('Content and an image are required');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = '';
      try {
        const uploaded = await uploadImage(imageFile);
        imageUrl = uploaded.url;
      } catch (err) {
        imageUrl = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg'; // fallback
      }

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(); // +1 day

      await createStory({
        content,
        imageUrl,
        userId: user.id,
        username: user.username,
        createdAt: now.toISOString(),
        expiresAt,
        viewedBy: []
      });

      navigate('/');
    } catch (err) {
      console.error('Error creating story:', err);
      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-4 pb-20 md:pb-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="flex items-center text-gray-700">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Cancel</span>
        </Link>
        <h1 className="text-xl font-semibold text-center flex-1">Create Story</h1>
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
          onClick={handleCreate}
          fullWidth
          isLoading={isSubmitting}
        >
          Publish Story
        </Button>
      </div>
    </div>
  );
};

export default StoryCreate;