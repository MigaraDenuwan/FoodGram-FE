import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import StoryCreate from './components/stories/StoryCreate';
import StoryEdit from './components/stories/StoryEdit';

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const CreateRecipe = lazy(() => import('./pages/CreateRecipe'));
const EditRecipe = lazy(() => import('./pages/EditRecipe')); // Add this
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'));
const StoryView = lazy(() => import('./pages/StoryView'));
const EditProfile = lazy(() => import('./pages/EditProfile'));

function App() {
  const { user, loading, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <LoadingSpinner size="large" />
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

        {/* Protected routes */}
        <Route element={<Layout />}>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profile/:id" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/profile/edit" element={user ? <EditProfile /> : <Navigate to="/login" />} />
          <Route path="/recipe/create" element={user ? <CreateRecipe /> : <Navigate to="/login" />} />
          <Route path="/recipe/edit/:id" element={user ? <EditRecipe /> : <Navigate to="/login" />} />          <Route path="/story/create" element={<StoryCreate />} />
          <Route path="/story/:id/edit" element={<StoryEdit />} />
          <Route path="/recipe/:id" element={user ? <RecipeDetail /> : <Navigate to="/login" />} />
          <Route path="/story/:id" element={user ? <StoryView /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;