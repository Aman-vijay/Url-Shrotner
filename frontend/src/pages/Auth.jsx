import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle2, Users } from 'lucide-react';
import Login from '@/components/Login';
import Signup from '@/components/Signup';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isNewUser = searchParams.get('createNew') === 'true';

  return (
    <div className="min-h-screen   dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-md mx-auto space-y-2">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Welcome
          </h1>
          {isNewUser && (
            <p className="text-sm text-muted-foreground animate-fade-in">
              Let's get you started with your new account
            </p>
          )}
        </div>

        <Tabs
          defaultValue={isNewUser ? 'signup' : 'login'}
          className="w-full  dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-xl p-4 sm:p-6"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <UserCircle2 className="w-4 h-4 mr-2" />
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="w-4 h-4 mr-2" />
              Sign Up
            </TabsTrigger>
          </TabsList>

          <div className="relative">
            <TabsContent
              value="login"
              className="data-[state=active]:animate-fade-in-up"
            >
              <Login />
            </TabsContent>
            <TabsContent
              value="signup"
              className="data-[state=active]:animate-fade-in-up"
            >
              <Signup />
            </TabsContent>
          </div>
        </Tabs>

        
      </div>
    </div>
  );
};

export default Auth;