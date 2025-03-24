import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {useSearchParams} from "react-router-dom"
import Login from '@/components/Login'
import Signup from '@/components/Signup'

const Auth = () => {
  const [ searchParams] = useSearchParams()
  return (
    <div className='mt-36 flex flex-col items-center gap-10 justify-center '>
      <h1 className='text-4xl font-extrabold'>Login/Signup</h1>
      {searchParams.get("createNew")?"Let's Login First":""}

<Tabs defaultValue="login" className="w-[400px] text-amber-50">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="login">Login</TabsTrigger>
    <TabsTrigger value="signup">Signup</TabsTrigger>
  </TabsList>
  <TabsContent value="login"><Login/></TabsContent>
  <TabsContent value="signup"><Signup/></TabsContent>
</Tabs>

    </div>
  )
}

export default Auth