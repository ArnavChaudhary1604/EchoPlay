import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSubscriptions = async () => {
      const token = localStorage.getItem("accessToken");
      const userString = localStorage.getItem("user");

      if (!token || !userString) {
        setLoading(false);
        setError("Please log in to view your subscriptions.");
        return;
      }
      
      try {
        const user = JSON.parse(userString);
        const subscriberId = user._id;

        const response = await axios.get(`${API_BASE_URL}/subscriptions/u/${subscriberId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Backend se channel details (avatar, fullName) laane ke liye ek extra API call
        const channelDetailsPromises = response.data.data.map((sub: any) => 
            axios.get(`${API_BASE_URL}/users/c/${sub.channel.username}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
        );
        
        const channelDetailsResponses = await Promise.all(channelDetailsPromises);
        const detailedSubscriptions = channelDetailsResponses.map(res => res.data.data);

        setSubscriptions(detailedSubscriptions);
      } catch (err) {
        setError("Failed to fetch subscriptions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) return <div className="text-center p-10 text-gray-400">Loading Subscriptions...</div>;
  
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-white mb-8">My Subscriptions</h1>
      {subscriptions.length > 0 ? (
        <div className="max-w-4xl mx-auto space-y-4">
          {subscriptions.map((channel) => (
            <div key={channel._id} className="flex items-center justify-between bg-[#121212] p-4 rounded-lg border border-gray-800 hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center space-x-4">
                <img src={channel.avatar} alt={channel.username} className="w-16 h-16 rounded-full" />
                <div>
                  <h2 className="text-lg font-semibold text-white">{channel.fullName}</h2>
                  <p className="text-sm text-gray-400">@{channel.username}</p>
                  <p className="text-xs text-gray-500">{channel.subcribersCount} subscribers</p>
                </div>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-full font-semibold hover:bg-gray-600">
                <Bell className="w-4 h-4" />
                <span>Subscribed</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10">You are not subscribed to any channels yet.</p>
      )}
    </div>
  );
}

export default Subscriptions;