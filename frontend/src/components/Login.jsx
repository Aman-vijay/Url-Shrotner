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
import { BeatLoader } from 'react-spinners'
import ErrorMessage from './ErrorMessage'
import * as Yup from "yup"
 import { useState } from 'react'
 import useFetch from '@/hooks/useFetch'



export const Login = () => {

const navigate = useNavigate();
const [errors,setErrors] = useState([])
const [formData, setFormData] = useState({
    email: "",
    password: ""
});


const handleInputChange = (e)=>{
    const {name,value} = e.target;
    setFormData((prevState)=>({
        ...prevState,
        [name]:value,
    }));
};

const handleLogin = async()=>{
    setErrors([]);
    try{
        const schema = Yup.object().shape({
            email:Yup.string().email("Invalid Email").required("Email is Required"),
            password:Yup.string().min(6,"Minimum should be 6 character").required("Password is Required")
        });
        await schema.validate(formData,{abortEarly:false});
    }
    catch(e){
        const newError = {};

        e?.inner?.forEach((err)=>{
            newError[err.path]= err.message;
        })

        setErrors(newError);
    }

}

const {data,error,loading,fn} = useFetch(handleSubmit,formData)
// const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const response = await fetch(`${backendUrl}/auth/login`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             email,
//             password,
//         }),
//     });
    
//     const data = await response.json();
//     if (response.ok) {
//         console.log("Login successful", data);
//         // Store token if provided
//         if (data.token) {
//             localStorage.setItem("token", data.token);
//         }
//         navigate("/dashboard");
//     } else {
//         console.error("Login failed", data);
       
//     }
// };

return (
    <div className='flex justify-center m-4'>
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
                <ErrorMessage message={"Some Error"}/>
            </CardHeader>

            <CardContent>
                <form >
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange} 
                                required
                            />
                            {errors.email &&< ErrorMessage message={errors.email}/>}
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                name="password"
                                placeholder="Enter your password" 
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            { errors.password && <ErrorMessage message={errors.password}/>}
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                    <div className="flex justify-between mt-4">
                    <Button onClick = {handleLogin} type="submit"> {true? <BeatLoader size={10} />:"Login"}</Button>
                    </div>
                    </CardFooter>
        </Card>
    </div>
)
}

export default Login;
