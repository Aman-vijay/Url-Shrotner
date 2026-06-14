import React from 'react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { signupSchema, authResponseSchema, parseOrThrow, getFormErrors } from '@/lib/schemas'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { BeatLoader } from 'react-spinners'
import { useAuth } from '../Context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import useFetch from '@/hooks/useFetch'
import { BackendUrl } from '@/utils/Urls'



const Signup = () => {
  

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const handleInputChange = (e)=>{
    const {name,value} = e.target;
    setFormData((prevState)=>({
      ...prevState,
      [name]: value,
    }))
    if(errors[name]){
      setErrors((prev)=>({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async () => {
    const response = await fetch(`${BackendUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...formData}),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Signup failed');
    const parsed = parseOrThrow(authResponseSchema, data, "Signup response");
    login(parsed.user);      
    localStorage.setItem('token', parsed.token);

    return parsed; 
  };
  
  const { data, loading, error, fetchData } = useFetch(handleSubmit, {});




  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('createNew') ;

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    const result = signupSchema.safeParse(formData);
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
        <User className="h-12 w-12 text-primary" />
      </div>
      <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
      <CardDescription className="text-center">
        Start shortening URLs today!
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form onSubmit={handleSignup} className="space-y-6">
        {data && (
          <Alert className="mb-4">
            <AlertDescription>Signup successful! Redirecting...</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error?.message || 'Something went wrong'}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                name="username"
                className="pl-9"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                aria-invalid={!!errors.username}
              />
            </div>
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                name="email"
                className="pl-9"
                aria-label="email"
                autoComplete="email"
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

          {/* Password */}
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
    <Button className="w-full" onClick={handleSignup} disabled={loading}>
  {loading ? <BeatLoader size={8} color="white" /> : 'Sign Up'}
</Button>

    </CardFooter>
  </Card>
);

};


export default Signup