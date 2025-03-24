import React from 'react'
 import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
const backendUrl = import.meta.env.VITE_BACKEND_URL
 



export const Login = () => {
const [email, setEmail] = React.useState("");
const [password, setPassword] = React.useState("");
const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
    
    const data = await response.json();
    if (response.ok) {
        console.log("Login successful", data);
        // Store token if provided
        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        navigate("/dashboard"); // Redirect to dashboard after login
    } else {
        console.error("Login failed", data);
       
    }
};

return (
    <div className='flex justify-center m-4'>
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                placeholder="Enter your password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-between mt-4">
                        <Button type="button" variant="outline" onClick={() => navigate("/register")}>Register</Button>
                        <Button type="submit">Sign In</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
)
}

export default Login;
