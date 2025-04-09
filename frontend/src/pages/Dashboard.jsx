import React, { useEffect, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { BarLoader } from 'react-spinners';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Filter } from "lucide-react"; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LinkCard from '@/components/LinkCard';
import CreateLink from '@/components/CreateLink';
import Error from './Error';
import { FrontendUrl, BackendUrl } from '@/utils/Urls';
import { toast, Toaster } from "react-hot-toast"; 

const getLinks = async ({ backendUrl, token }) => {
  const result = await fetch(`${backendUrl}/api/geturls`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!result.ok) {
    if (result.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch links');
  }

  return await result.json();
};

const deleteUrl = async ({ backendUrl, token, urlId }) => {
  const res = await fetch(`${backendUrl}/api/deleteUrl/${urlId}`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  if (!res.ok) {
    throw new Error('Failed to delete the url');
  }
  return await res.json();
};

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [searchLink, setSearchLink] = useState("");
    // const [searchParams] = useSearchParams();
  

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

  const showToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message, { position: "bottom-left" });
    } else {
      toast.error(message, { position: "bottom-left" });
    }
  };

  if (loading) {
    return <BarLoader width={"100%"} color="#36d7b7" />;
  }

  if (error) {
    return <Error message={error.message || "Something went wrong while fetching links."} />;
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
       
          <CreateLink onSuccess={fetchData} />

         
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
          {!links || links.length === 0 ? (
            <p className="text-gray-400 text-center">No links have been created yet.</p>
          ) : filteredUrls?.length === 0 ? (
            <p className="text-gray-400 text-center">No links match your search.</p>
          ) : (
            <ul className="list-none space-y-4">
              {filteredUrls?.map((url, i) => (
                <LinkCard
                  key={i}
                  url={url}
                  frontendUrl={FrontendUrl}
                  showToast={showToast}
                  deleteUrl={deleteUrl}
                  fetchData={fetchData}
                />
              ))}
            </ul>
          )}
        </div>

        <Toaster position="top-left" reverseOrder={false} />
      </div>
    </div>
  );
};

export default Dashboard;