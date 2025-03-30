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
import { useEffect } from 'react'
const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const [searchLink,setSearchLink] = useState("")
  const [links,setLinks]= useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetch(`${backendUrl}/url/geturls`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!result.ok) {
        throw new Error('Failed to fetch links');
      }

      
      const res = await result.json();
      setLinks(res);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching links:', err);
      setError(err.message || 'Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(token){
  
      getLinks();}
  }, []);



  return (
    <div>
      {loading && <BarLoader width={"100%"} color="#36d7b7" />}
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

        {links && links.map((link) => (
          <li key={link._id}>
            <a href={link.redirectUrl} target="_blank" rel="noopener noreferrer">
              {link.shortUrl}
            </a>
          </li>
        ))}
        {/* <Error message={error.message}/>; */}
        
        </div>

    </div>
  )
}

export default Dashboard