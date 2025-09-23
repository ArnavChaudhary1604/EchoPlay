import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api/v1/subscriptions";

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSubscriptions = async () => {
      const token = localStorage.getItem("accessToken");
      const userString = localStorage.getItem("user");

      if (!token || !userString) {
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userString);
      const subscriberId = user._id;

      try {
        const response = await axios.get(`${API_BASE_URL}/u/${subscriberId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubscriptions(response.data.data);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) return <div className="text-center p-10">Loading Subscriptions...</div>;
  
  if (subscriptions.length === 0) {
    return <div className="text-center p-10">You are not subscribed to any channels.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Subscriptions</h1>
      <div className="space-y-4">
        {subscriptions.map((sub) => (
          <div key={sub._id} className="flex items-center bg-white p-4 rounded-lg shadow">
            {/* The channel data is nested inside the 'channel' property */}
            <img src={sub.channel.avatar} alt={sub.channel.username} className="w-16 h-16 rounded-full mr-4" />
            <div>
              <h2 className="text-xl font-semibold">{sub.channel.fullName}</h2>
              <p className="text-gray-600">@{sub.channel.username}</p>
            </div>
            {/* You can add a link to the channel profile here */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subscriptions;