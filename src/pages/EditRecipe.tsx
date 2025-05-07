import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Minus, Upload, ArrowLeft, X } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getPost, updatePost } from '../services/postService';
import { uploadImage } from '../utils/imageKit';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Reuse the same schema as CreateRecipe
const recipeSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Description must be at least 10 characters'),
  cookTime: z.string().min(1, 'Cook time is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  ingredients: z.array(
    z.object({
      value: z.string().min(1, 'Ingredient cannot be empty'),
    })
  ).min(1, 'Add at least one ingredient'),
  steps: z.array(
    z.object({
      value: z.string().min(1, 'Step cannot be empty'),
    })
  ).min(1, 'Add at least one step'),
  tags: z.array(
    z.object({
      value: z.string().min(1, 'Tag cannot be empty'),
    })
  ),
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

const EditRecipe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } =
    useFieldArray({ control, name: 'ingredients' });

  const { fields: stepFields, append: appendStep, remove: removeStep } =
    useFieldArray({ control, name: 'steps' });

  const { fields: tagFields, append: appendTag, remove: removeTag } =
    useFieldArray({ control, name: 'tags' });

  // Fetch post data on mount
  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const post = await getPost(id);
        if (post.userId !== user?.id) {
          navigate('/'); // Redirect if user is not the owner
          return;
        }
        reset({
          title: post.title,
          content: post.content,
          cookTime: post.cookTime,
          difficulty: post.difficulty,
          ingredients: post.ingredients.map((value) => ({ value })),
          steps: post.steps.map((value) => ({ value })),
          tags: post.tags.map((value) => ({ value })),
        });
        setImagePreview(post.imageUrl);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/');
      }
    }
    fetchPost();
  }, [id, user, navigate, reset]);

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

  const onSubmit = async (data: RecipeFormValues) => {
    if (!id || !user) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = imagePreview || '';
      if (imageFile) {
        try {
          const uploadResult = await uploadImage(imageFile);
          imageUrl = uploadResult.url;
        } catch (error) {
          console.error('Error uploading image:', error);
          imageUrl = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg';
        }
      }

      const postData = {
        id,
        title: data.title,
        content: data.content,
        imageUrl,
        userId: user.id,
        username: user.username || 'Unknown',
        createdAt: new Date().toISOString(),
        likes: 0, // Preserve existing likes or reset as needed
        ingredients: data.ingredients.map((i) => i.value),
        steps: data.steps.map((s) => s.value),
        tags: data.tags.map((t) => t.value),
        cookTime: data.cookTime,
        difficulty: data.difficulty,
      };

      const updatedPost = await updatePost(id, postData);
      navigate(`/recipe/${updatedPost.id}`);
    } catch (error) {
      console.error('Error updating recipe:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="pt-4 pb-20 md:pb-8">
      <div className="flex items-center mb-6">
        <Link to={`/recipe/${id}`} className="flex items-center text-gray-700">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to recipe</span>
        </Link>
        <h1 className="text-xl font-semibold text-center flex-1">Edit Recipe</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
        {/* Image upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Image</label>
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center ${
              imageError ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Recipe preview" className="max-h-64 mx-auto rounded" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-5 w-5" />
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

        {/* Title and Description */}
        <div className="space-y-4 mb-6">
          <Input
            label="Recipe Title"
            placeholder="E.g., Homemade Pasta Carbonara"
            error={errors.title?.message}
            {...register('title')}
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Describe your recipe..."
              className={`w-full rounded-md border px-3 py-2 ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500`}
              rows={3}
              {...register('content')}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>
        </div>

        {/* Cook Time and Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Cook Time"
            placeholder="E.g., 30 minutes"
            error={errors.cookTime?.message}
            {...register('cookTime')}
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              className={`w-full rounded-md border px-3 py-2 ${
                errors.difficulty ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500`}
              {...register('difficulty')}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            {errors.difficulty && (
              <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
            )}
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Ingredients</label>
            <button
              type="button"
              onClick={() => appendIngredient({ value: '' })}
              className="text-accent-500 hover:text-accent-600 text-sm flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Ingredient
            </button>
          </div>
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex items-center mb-2">
              <input
                {...register(`ingredients.${index}.value`)}
                placeholder="E.g., 2 cups flour"
                className={`flex-1 rounded-md border px-3 py-2 ${
                  errors.ingredients?.[index]?.value ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500`}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="ml-2 text-red-500"
                >
                  <Minus className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          {errors.ingredients && (
            <p className="mt-1 text-sm text-red-600">
              {typeof errors.ingredients.message === 'string'
                ? errors.ingredients.message
                : 'Please add valid ingredients'}
            </p>
          )}
        </div>

        {/* Steps */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Instructions</label>
            <button
              type="button"
              onClick={() => appendStep({ value: '' })}
              className="text-accent-500 hover:text-accent-600 text-sm flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Step
            </button>
          </div>
          {stepFields.map((field, index) => (
            <div key={field.id} className="flex items-start mb-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-500 text-white flex items-center justify-center text-sm mr-2 mt-2">
                {index + 1}
              </div>
              <textarea
                {...register(`steps.${index}.value`)}
                placeholder={`Step ${index + 1} instructions...`}
                rows={2}
                className={`flex-1 rounded-md border px-3 py-2 ${
                  errors.steps?.[index]?.value ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500`}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="ml-2 text-red-500 mt-2"
                >
                  <Minus className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          {errors.steps && (
            <p className="mt-1 text-sm text-red-600">
              {typeof errors.steps.message === 'string'
                ? errors.steps.message
                : 'Please add valid steps'}
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <button
              type="button"
              onClick={() => appendTag({ value: '' })}
              className="text-accent-500 hover:text-accent-600 text-sm flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Tag
            </button>
          </div>
          {tagFields.map((field, index) => (
            <div key={field.id} className="flex items-center mb-2">
              <input
                {...register(`tags.${index}.value`)}
                placeholder="E.g., italian"
                className={`flex-1 rounded-md border px-3 py-2 ${
                  errors.tags?.[index]?.value ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500`}
              />
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-2 text-red-500"
              >
                <Minus className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Submit button */}
        <div className="mt-8">
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Update Recipe
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipe;