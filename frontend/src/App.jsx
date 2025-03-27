import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Import AuthContext
import AppLayout from "./layouts/AppLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Link from "./pages/Link";
import Redirect from "./pages/Redirect";
import Error from "./pages/Error";

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();  
  return user ? element : <Navigate to="/auth" replace />;
};

// Redirect if Logged In
const AuthRedirect = ({ element }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : element;
};

// Define Routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout />} errorElement={<Error />}>
      <Route index element={<Landing />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/auth" element={<AuthRedirect element={<Auth />} />} />
      <Route path="/link/:id" element={<Link />} />
      <Route path="/:id" element={<Redirect />} />
    </Route>
  )
);


function App() {
  return <RouterProvider router={router} />;
}

export default App;
