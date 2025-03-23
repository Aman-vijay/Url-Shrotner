import React from 'react'
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'

const Error = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-6xl font-bold text-red-500">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-300">Page not found</h2>
                    <div className="h-1 w-20 bg-red-500 mx-auto my-4"></div>
                    <p className="text-gray-400">The page you're looking for doesn't exist or has been moved.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
                    <Button 
                        variant="default" 
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => navigate('/')}
                    >
                        Go Home
                    </Button>
                    <Button 
                        variant="outline" 
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Error