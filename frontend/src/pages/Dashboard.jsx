import React from 'react'
import { useAuth } from '../Context/AuthContext'
import { BarLoader } from 'react-spinners'
import { Card,CardAction,CardContent,CardHeader,CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Filter } from 'lucide-react'
import Error from './Error'
const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const [searchLink,setSearchLink] = useState("")



  return (
    <div>
      {true && <BarLoader width={"100%"} color="#36d7b7" />}
      <div className='flex flex-col gap-4'>
        <Card className='w-full'>
          <CardContent className='flex flex-col  items-center gap-2'>
            <CardTitle className='text-2xl font-bold'>Dashboard</CardTitle>
            <p>Welcome to your dashboard! <b>{user.username}</b></p>
          </CardContent>
        </Card>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Card >
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <p>0</p>
           
          </CardContent>
        </Card>
        <Card >
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <p> 0 Clicks</p>
           
          </CardContent>
        </Card>
        </div>
        <div className=' flex justify-between p-2'>
          <h1 className='text-3xl font-extrabold'> My Links</h1>
          <Link to="/">
          <Button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>Create New Link</Button>
          </Link>
        </div>
        <div className='relative mr-4'>
          <Input type="text" placeholder="Search your links" className=" "
          value={searchLink}
          onChange = {(e)=> setSearchLink(e.target.value)}
           />
           <Filter className='absolute top-2 right-2 p-1'/>
        </div>
        {/* <Error message={error.message}/>; */}
        
        </div>

    </div>
  )
}

export default Dashboard