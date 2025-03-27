import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { BeatLoader } from 'react-spinners';
import { useAuth } from "@/context/AuthContext";
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
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import useFetch from '@/hooks/useFetch';
import {useSearchParams} from "react-router-dom";


const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Login = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
    const longLink = searchParams.get('createNew') ;
   
   

    const handleSubmit = async () => {
        const response = await fetch(`${backendUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, rememberMe }),
        });
      
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        login(data.user);      
        localStorage.setItem('token', data.token);
        if (rememberMe) localStorage.setItem('rememberedEmail', formData.email);
        else localStorage.removeItem('rememberedEmail');
      
        return data; 
      };
      

  const { error,data, loading, fetchData } = useFetch(handleSubmit, {});

    useEffect(() => {
        if(error=== null && data){
            navigate(`/dashboard?${longLink?`createNew=${longLink}`:''}`);
        }
    }, [error, data, navigate])
   
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Please enter a valid email address')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
      });

      await schema.validate(formData, { abortEarly: false });
      fetchData();
    } catch (e) {
      const newErrors = {};
      e.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <Card className="w-[400px] shadow-xl">
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
                  error={errors.email}
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
                  error={errors.password}
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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked)}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>
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