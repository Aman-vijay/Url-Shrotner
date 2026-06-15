import React, { useEffect, useState, useDeferredValue, useMemo } from 'react';
import useFetch from '@/hooks/useFetch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react"; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LinkCard from '@/components/LinkCard';
import CreateLink from '@/components/CreateLink';
import Error from './Error';
import { BackendUrl } from '@/utils/Urls';
import { toast, Toaster } from "react-hot-toast"; 
import { urlsSchema, parseOrThrow } from '@/lib/schemas';

const PAGE_SIZE = 8;

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

  const data = await result.json();
  return parseOrThrow(urlsSchema, data, "Links response");
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

const LinkListSkeleton = () => (
  <div className="space-y-4" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <div key={i} className="h-24 bg-secondary animate-pulse rounded-lg" />
    ))}
  </div>
);

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [searchLink, setSearchLink] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(searchLink);
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

  const filteredUrls = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    const filtered = (links || []).filter(
      (url) =>
        !q ||
        url.shortUrl.toLowerCase().includes(q) ||
        url.redirectUrl.toLowerCase().includes(q)
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return sorted;
  }, [links, deferredSearch, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredUrls.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pagedUrls = filteredUrls.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const showToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message, { position: "bottom-left" });
    } else {
      toast.error(message, { position: "bottom-left" });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <LinkListSkeleton />
      </div>
    );
  }

  if (error) {
    return <Error message={error.message || "Something went wrong while fetching links."} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4'>
          <Card className='w-full'>
            <CardContent className='flex flex-col items-center gap-2 py-6'>
              <CardTitle className='text-2xl font-bold'>Dashboard</CardTitle>
              <p className="text-muted-foreground">Welcome to your dashboard! <span className="text-foreground font-semibold">{user.username}</span></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Links Created</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{links?.length || 0}</p></CardContent>
          </Card>
        </div>
        <div className='flex items-center justify-between flex-wrap gap-3'>
          <h1 className='text-3xl font-extrabold'>My Links</h1>
          <CreateLink onSuccess={fetchData} />
        </div>
        <div className='flex flex-col sm:flex-row gap-3 items-stretch sm:items-center'>
          <div className='relative flex-1'>
            <Input
              type="text"
              placeholder="Search your links"
              value={searchLink}
              onChange={(e) => { setSearchLink(e.target.value); setPage(1); }}
              aria-label="Search your links"
              className="pl-9 pr-9"
            />
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' size={16} aria-hidden="true" />
            {searchLink && (
              <button
                type="button"
                onClick={() => { setSearchLink(""); setPage(1); }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Sort
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </label>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          {!links || links.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <p className="text-muted-foreground">No links have been created yet.</p>
              <CreateLink onSuccess={fetchData} />
            </div>
          ) : filteredUrls?.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No links match your search.</p>
          ) : (
            <>
              <ul className="list-none space-y-4">
                {pagedUrls?.map((url, i) => (
                  <LinkCard
                    key={url?._id || i}
                    url={url}
                    showToast={showToast}
                    deleteUrl={deleteUrl}
                    fetchData={fetchData}
                  />
                ))}
              </ul>

              {pageCount > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} aria-hidden="true" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {pageCount}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(Math.min(pageCount, currentPage + 1))}
                    disabled={currentPage >= pageCount}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} aria-hidden="true" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <Toaster position="bottom-left" reverseOrder={false} />
      </div>
    </div>
  );
};

export default Dashboard;
