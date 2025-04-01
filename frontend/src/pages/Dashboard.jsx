import React, { useEffect, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { BarLoader } from 'react-spinners';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Copy, Trash, Filter } from "lucide-react"; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LinkCard from '@/components/LinkCard';
import Error from './Error';
import { toast } from "react-hot-toast";  
import { FrontendUrl,BackendUrl } from '@/utils/Urls';


const getLinks = async ({ backendUrl, token }) => {
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

  return await result.json();
};

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [searchLink, setSearchLink] = useState("");

  const { data: links, loading, error, fetchData } = useFetch(getLinks, {
    backendUrl: BackendUrl,
    token: localStorage.getItem("token")
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchData();
    }
  }, []);

  const filteredUrls = links?.filter((url) =>
    url.shortUrl.toLowerCase().includes(searchLink.toLowerCase()) ||
    url.redirectUrl.toLowerCase().includes(searchLink.toLowerCase())
  );

 

  if (loading) {
    return <BarLoader width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <div className='flex flex-col gap-4'>
        <Card className='w-full'>
          <CardContent className='flex flex-col items-center gap-2'>
            <CardTitle className='text-2xl font-bold'>Dashboard</CardTitle>
            <p>Welcome to your dashboard! <b>{user.username}</b></p>
          </CardContent>
        </Card>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <Card>
            <CardHeader><CardTitle>Links Created</CardTitle></CardHeader>
            <CardContent><p>{links?.length || 0}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Total Clicks</CardTitle></CardHeader>
            <CardContent>
              <p>{links?.reduce((sum, link) => sum + (link.clicks || 0), 0)} Clicks</p>
            </CardContent>
          </Card>
        </div>
        <div className='flex justify-between p-2'>
          <h1 className='text-3xl font-extrabold'>My Links</h1>
          <Link to="/">
            <Button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>
              Create New Link
            </Button>
          </Link>
        </div>
        <div className='relative mr-4'>
          <Input
            type="text"
            placeholder="Search your links"
            value={searchLink}
            onChange={(e) => setSearchLink(e.target.value)}
          />
          <Filter className='absolute top-2 right-2 p-1' />
        </div>

        <div className="shadow-lg rounded-md bg-gray-800 p-4 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-700">
          {filteredUrls?.length === 0 ? (
            <p className="text-gray-400 text-center">No links found.</p>
          ) : (
            // <ul className="list-none space-y-4">
            //   {filteredUrls?.map((link) => (
            //     <li key={link._id} className="bg-gray-900 p-3 rounded-md flex flex-col sm:flex-row sm:items-center justify-between">
            //       <div className="flex flex-col">
            //         <div className='font-bold'>{link.title || "Default Title"}</div>
            //         <a
            //           href={link.redirectUrl}
            //           target="_blank"
            //           rel="noopener noreferrer"
            //           className="text-blue-400 font-semibold hover:underline"
            //         >
            //           {link.shortUrl}
            //         </a>
            //         <p className="text-gray-400 text-sm truncate w-[90%]">{link.redirectUrl}</p>
            //         <p className="text-gray-500 text-xs">Created: {new Date(link.createdAt).toLocaleDateString()}</p>
            //       </div>
            //       <div className="flex gap-2 mt-2 sm:mt-0">
            //         <Button
            //           variant="outline"
            //           size="sm"
            //           onClick={() => copyToClipboard(`${window.location.origin}/${link.shortUrl}`)}
            //           className="flex items-center gap-1"
            //         >
            //           <Copy size={16} /> Copy
            //         </Button>
            //         <Button variant="destructive" size="sm" className="flex items-center gap-1">
            //           <Trash size={16} /> Delete
            //         </Button>
            //       </div>
            //     </li>
            //   ))}
            // </ul>
            <ul className="list-none space-y-4">
           {filteredUrls?.map((url,i)=>{
            return <LinkCard key={i} url={url} frontendUrl={FrontendUrl} fetchUrl={fetchData}/>
           })}
           </ul>
          )}
        </div>

        {error && <Error message={error.message || error} />}
      </div>
    </div>
  );
};

export default Dashboard;
