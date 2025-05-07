// This file contains mock data for development purposes

import { Post } from '../services/postService';
import { Story } from '../services/storyService';
import { Profile } from '../services/profileService';
import { Comment } from '../services/commentService';

export const mockPosts: Post[] = [
  {
    id: 'post1',
    title: 'Homemade Pasta Carbonara',
    content: 'The best carbonara recipe you will ever taste!',
    imageUrl: 'https://images.pexels.com/photos/5175537/pexels-photo-5175537.jpeg',
    userId: 'user1',
    username: 'chefmaria',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likes: 234,
    ingredients: [
      '200g spaghetti',
      '100g pancetta',
      '2 large eggs',
      '50g pecorino cheese',
      'Freshly ground black pepper'
    ],
    steps: [
      'Cook pasta until al dente',
      'Fry pancetta until crisp',
      'Mix eggs and cheese in a bowl',
      'Combine all ingredients while pasta is hot'
    ],
    tags: ['pasta', 'italian', 'quick'],
    cookTime: '20 minutes',
    difficulty: 'medium'
  },
  {
    id: 'post2',
    title: 'Classic Avocado Toast',
    content: 'Start your day with this nutritious and delicious breakfast!',
    imageUrl: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg',
    userId: 'user2',
    username: 'healthyeats',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likes: 187,
    ingredients: [
      '1 ripe avocado',
      '2 slices of sourdough bread',
      'Salt and pepper to taste',
      'Red pepper flakes',
      '1 lime'
    ],
    steps: [
      'Toast bread until golden',
      'Mash avocado in a bowl',
      'Add lime juice, salt and pepper',
      'Spread on toast and add toppings'
    ],
    tags: ['breakfast', 'healthy', 'vegan'],
    cookTime: '10 minutes',
    difficulty: 'easy'
  },
  {
    id: 'post3',
    title: 'Thai Green Curry',
    content: 'Authentic Thai curry that will transport you straight to Bangkok!',
    imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg',
    userId: 'user3',
    username: 'asianfusion',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    likes: 312,
    ingredients: [
      '400ml coconut milk',
      '2 tbsp green curry paste',
      '500g chicken thighs',
      'Thai basil',
      'Fish sauce'
    ],
    steps: [
      'Fry curry paste in oil',
      'Add coconut milk and bring to simmer',
      'Add chicken and cook through',
      'Season with fish sauce and garnish with basil'
    ],
    tags: ['thai', 'curry', 'spicy'],
    cookTime: '35 minutes',
    difficulty: 'medium'
  }
];

export const mockStories: Story[] = [
  {
    id: 'story1',
    content: 'Making sourdough bread today!',
    imageUrl: 'https://images.pexels.com/photos/139746/pexels-photo-139746.jpeg',
    userId: 'user1',
    username: 'chefmaria',
    createdAt: new Date(Date.now() - 60000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    viewedBy: ['user2']
  },
  {
    id: 'story2',
    content: 'Fresh farmers market haul!',
    imageUrl: 'https://images.pexels.com/photos/8105035/pexels-photo-8105035.jpeg',
    userId: 'user2',
    username: 'healthyeats',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    viewedBy: []
  },
  {
    id: 'story3',
    content: 'Spice hunting in the local market',
    imageUrl: 'https://images.pexels.com/photos/4226805/pexels-photo-4226805.jpeg',
    userId: 'user3',
    username: 'asianfusion',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    viewedBy: ['user1']
  }
];

export const mockProfiles: Profile[] = [
  {
    id: 'profile1',
    userId: 'user1',
    name: 'Maria Rodriguez',
    bio: 'Italian chef specializing in authentic pasta dishes. Food is love.',
    avatarUrl: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.png',
    followers: 5243,
    following: 365,
    recipeCount: 87,
    email: ''
  },
  {
    id: 'profile2',
    userId: 'user2',
    name: 'Sarah Johnson',
    bio: 'Nutritionist and healthy food enthusiast. Making wellness delicious.',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    followers: 3821,
    following: 412,
    recipeCount: 54,
    email: ''
  },
  {
    id: 'profile3',
    userId: 'user3',
    name: 'Raj Patel',
    bio: 'Asian fusion chef bringing traditional flavors to modern cuisine.',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    followers: 7512,
    following: 230,
    recipeCount: 126,
    email: ''
  }
];

export const mockComments: Record<string, Comment[]> = {
  post1: [
    {
      id: 'comment1',
      content: 'Tried this recipe last night and it was amazing!',
      postId: 'post1',
      userId: 'user2',
      username: 'healthyeats',
      createdAt: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'comment2',
      content: 'What type of pancetta do you recommend?',
      postId: 'post1',
      userId: 'user3',
      username: 'asianfusion',
      createdAt: new Date(Date.now() - 900000).toISOString()
    }
  ],
  post2: [
    {
      id: 'comment3',
      content: 'I add a poached egg on top for extra protein!',
      postId: 'post2',
      userId: 'user1',
      username: 'chefmaria',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  post3: [
    {
      id: 'comment4',
      content: 'Is there a vegetarian version of this recipe?',
      postId: 'post3',
      userId: 'user2',
      username: 'healthyeats',
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'comment5',
      content: 'The flavors are so authentic! Love it.',
      postId: 'post3',
      userId: 'user1',
      username: 'chefmaria',
      createdAt: new Date(Date.now() - 5400000).toISOString()
    }
  ]
};