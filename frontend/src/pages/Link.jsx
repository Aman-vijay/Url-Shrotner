import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { BackendUrl } from '@/utils/Urls';
import useFetch from '@/hooks/useFetch';
import { BarLoader } from 'react-spinners';
const Link = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  

  
  const fetchUrlById = async ()=>{
    try{
      const response = await fetch(`${BackendUrl}/api/url/${id}`,{
        method:"GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"}
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const res = await response.json();
         return res;
    }
    catch(err){
      throw new Error(`HTTP error! status: ${err}`);

    }
  }

  const fetchAnalytics = async () => {
    try {
    
      
      const response = await fetch(`${BackendUrl}/api/analytics/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const res = await response.json();
       return res;
  
   
    } catch (err) {
    
      console.error('Error fetching analytics:', err);
    }
  };
  

  const { error,data:analytics, loading, fetchData} = useFetch(fetchAnalytics);
  const { error:urlError,data:url,  fetchData:fetchUrl} = useFetch(fetchUrlById);

  useEffect(() => {
   

    if (id) {
      fetchData();
      fetchUrl();
    }
  }, [id]);

  if (loading) {
    return <BarLoader className='mb-4' width={"100%"} color=''/>;
  }

  if (error || urlError) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className='mx-auto p-4'>
      <h1 className="text-2xl font-bold mb-4">Analytics for: {id}</h1>
      <div className=" flex flex-row  gap-x-4 w-6/12 ">
<div>
      {url &&(
        <div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/15 transition">
            {url.map((item)=>{
              return(
               <div key={item?.id}>
                <div>{item?.title}</div>
                <div>{item?.shortUrl}</div>
                <div>{item?.redirectUrl}</div>
                <img src={item?.qr}/>
               </div>
              )
            })}
            </div>
        </div>
      )}
      </div>
     
     
<div>
      {analytics && (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/15 transition">
              <h2 className="text-lg font-semibold">Total Clicks</h2>
              <p className="text-3xl font-bold">{analytics.totalClicks}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/15 transition">
              <h2 className="text-lg font-semibold">Original URL</h2>
              <p className="text-sm break-all">{analytics.url}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/15 transition">
              <h2 className="text-lg font-semibold">Created At</h2>
              <p>{new Date(analytics.createdAt).toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/15 transition">
              <h2 className="text-lg font-semibold">Last Clicked</h2>
              <p>{analytics.lastClickedAt ? new Date(analytics.lastClickedAt).toLocaleString() : 'N/A'}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Clicks Per Day</h2>
            {analytics.clicksPerDay && Object.keys(analytics.clicksPerDay).length > 0 ? (
              <div className="overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(analytics.clicksPerDay).map(([date, count], index) => (
                      <tr key={date} className={index % 2 === 0 ? "bg-white/5" : ""}>
                        <td className="px-4 py-3">{date}</td>
                        <td className="px-4 py-3">{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="bg-white/10 p-4 rounded-lg">No daily click analytics available</p>
            )}
          </div>
        </div>
      )}
      </div>
      </div>
    </div>
  );
};


export default Link;