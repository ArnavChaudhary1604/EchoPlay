import { useState, useEffect } from "react";
import VideoCard from "../components/VideoCard";
import { Card } from "../components/ui/Card";
import { videoApi } from "../services/api";
import type { Video } from "../types/api";

function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const fetchVideos = async (pageNum = 1, reset = false) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        setError("Please log in to view videos.");
        return;
      }

      const response = await videoApi.getAllVideos(pageNum, 12, '', 'createdAt', 'desc');
      
      if (response.success) {
        const newVideos = response.data.videos;
        setVideos(reset ? newVideos : prev => [...prev, ...newVideos]);
        setTotalPages(response.data.totalPages);
        setHasMore(pageNum < response.data.totalPages);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch videos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(1, true);
  }, []);

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchVideos(nextPage, false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <Card key={i} className="h-64 animate-pulse">
              <div className="w-full h-40 bg-surface-light rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-surface-light rounded w-3/4"></div>
                <div className="h-3 bg-surface-light rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="text-center max-w-md">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Something went wrong</h2>
          <p className="text-text-secondary">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 animate-slide-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Welcome to EchoPlay
        </h1>
        <p className="text-text-secondary">
          Discover amazing videos and share your thoughts with the community
        </p>
      </div>

      {videos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {videos.map((video, index) => (
              <div key={video._id} className="animate-fade-in" style={{ animationDelay: `${(index % 12) * 0.1}s` }}>
                <VideoCard video={video} />
              </div>
            ))}
          </div>
          
          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="btn-secondary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Load More Videos"}
              </button>
            </div>
          )}
          
          {/* Page Info */}
          <div className="text-center mt-4 text-text-muted text-sm">
            Showing {videos.length} videos {totalPages > 1 && `• Page ${Math.min(page, totalPages)} of ${totalPages}`}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center min-h-96">
          <Card className="text-center max-w-md">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">No videos yet</h2>
            <p className="text-text-secondary mb-4">
              Be the first to share amazing content with the community!
            </p>
            <a href="/upload-video" className="btn-primary inline-flex items-center space-x-2">
              <span>Upload Video</span>
            </a>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Home;