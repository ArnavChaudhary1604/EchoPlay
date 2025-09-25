import { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import VideoCard from "../components/VideoCard";
import { Users, Bell, BellOff } from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Subscriptions() {
  const [videos, setVideos] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Please log in to view your subscriptions.");
          setLoading(false);
          return;
        }

        // Simulate subscription data - replace with actual API calls
        setSubscriptions([
          { id: 1, username: "TechGuru", avatar: "https://via.placeholder.com/40", subscribers: "1.2M" },
          { id: 2, username: "CodeMaster", avatar: "https://via.placeholder.com/40", subscribers: "850K" },
          { id: 3, username: "DesignPro", avatar: "https://via.placeholder.com/40", subscribers: "650K" },
        ]);
        
        setVideos([]);
      } catch (err) {
        setError("Failed to fetch subscriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Your Subscriptions
        </h1>
        <p className="text-text-secondary">
          Stay updated with content from creators you follow
        </p>
      </div>

      {/* Subscribed Channels */}
      {subscriptions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Subscribed Channels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subscriptions.map((channel) => (
              <Card key={channel.id} className="!p-4 text-center">
                <img
                  src={channel.avatar}
                  alt={channel.username}
                  className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-border"
                />
                <h3 className="font-semibold text-text-primary mb-1">{channel.username}</h3>
                <p className="text-sm text-text-secondary mb-3">{channel.subscribers} subscribers</p>
                
                <div className="flex space-x-2">
                  <button className="flex-1 btn-secondary text-sm py-2">
                    <Bell className="w-4 h-4 mr-1" />
                    Subscribed
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Latest Videos */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Latest from Your Subscriptions
        </h2>
        
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {videos.map((video, index) => (
              <div key={video._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-64">
            <Card className="text-center max-w-md">
              <div className="text-6xl mb-4">📺</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">No new videos</h3>
              <p className="text-text-secondary mb-4">
                Your subscribed channels haven't posted any new content yet.
              </p>
              <a href="/" className="btn-primary inline-flex items-center space-x-2">
                <span>Discover More Channels</span>
              </a>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default Subscriptions;