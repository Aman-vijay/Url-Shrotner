import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { BackendUrl } from '@/utils/Urls';
const Link = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
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
        
        const data = await response.json(); 
       
        setAnalytics(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch analytics data');
        setLoading(false);
        console.error('Error fetching analytics:', err);
      }
    };

    if (id) {
      fetchAnalytics();
    }
  }, [id, token]);

  if (loading) {
    return <div className="text-center p-4">Loading analytics data...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics for: {id}</h1>

      {analytics && (
        <div className="bg-white text-black shadow rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className=" p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Total Clicks</h2>
              <p className="text-3xl font-bold">{analytics.totalClicks}</p>
            </div>
            <div className=" p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Original URL</h2>
              <p className="text-sm break-all">{analytics.url}</p>
            </div>
            <div className=" p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Created At</h2>
              <p>{new Date(analytics.createdAt).toLocaleString()}</p>
            </div>
            <div className=" p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Last Clicked</h2>
              <p>{analytics.lastClickedAt ? new Date(analytics.lastClickedAt).toLocaleString() : 'N/A'}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Clicks Per Day</h2>
            {analytics.clicksPerDay && Object.keys(analytics.clicksPerDay).length > 0 ? (
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(analytics.clicksPerDay).map(([date, count]) => (
                    <tr key={date}>
                      <td className="px-4 py-2 border">{date}</td>
                      <td className="px-4 py-2 border">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No daily click data available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default Link;