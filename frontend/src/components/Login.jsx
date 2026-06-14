import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginSchema, authResponseSchema, parseOrThrow, getFormErrors } from '@/lib/schemas';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { BeatLoader } from 'react-spinners';
import { useAuth } from "../Context/AuthContext";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import useFetch from '@/hooks/useFetch';
import { BackendUrl } from '@/utils/Urls';
export const Login = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('createNew') ;
   
   

    const handleSubmit = async () => {
        const response = await fetch(`${BackendUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData }),
        });
      
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        const parsed = parseOrThrow(authResponseSchema, data, "Login response");
        login(parsed.user);      
        localStorage.setItem('token', parsed.token);
      
        return parsed; 
      };
      

  const { error, loading, fetchData } = useFetch(handleSubmit, {});

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      setErrors(getFormErrors(result.error) || {});
      return;
    }
    const res = await fetchData();
    if (res) {
      navigate(`/dashboard${redirectUrl ? `?createNew=${redirectUrl}` : ''}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-3">
        <div className="flex justify-center">
          <Lock className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
           <Alert variant="destructive" className="mb-4">
           <AlertDescription>{error?.message || 'Something went wrong'}</AlertDescription>
         </Alert>
         
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  className="pl-9"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="pl-9"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
      <Button className="w-full" onClick={handleLogin} disabled={loading}>
  {loading ? <BeatLoader size={8} color="white" /> : 'Sign in'}
</Button>

      
      </CardFooter>
    </Card>
  );
};

export default Login;