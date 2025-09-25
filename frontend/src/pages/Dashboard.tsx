import { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Users, Eye, ThumbsUp, Video, TrendingUp, Calendar } from "lucide-react";
import { dashboardApi } from "../services/api";
import type { DashboardStats } from "../types/api";

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVideos: 0,
    totalViews: 0,
    totalSubscribers: 0,
    totalLikes: 0,
    channelStats: {
      totalVideos: 0,
      totalViews: 0,
      totalSubscribers: 0,
      totalLikes: 0,
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Please log in to view dashboard.");
          setLoading(false);
          return;
        }

        const response = await dashboardApi.getChannelStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error: any) {
        console.error("Failed to fetch dashboard data:", error);
        setError(error.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-32 animate-pulse">
              <div className="w-full h-full bg-surface-light rounded-lg"></div>
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
          <h2 className="text-xl font-semibold text-text-primary mb-2">Dashboard Error</h2>
          <p className="text-text-secondary">{error}</p>
        </Card>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <Card className="!p-6 text-center">
      <div className={`w-12 h-12 rounded-xl bg-gradient-${color} mx-auto mb-4 flex items-center justify-center shadow-glow`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-text-primary mb-1">{value.toLocaleString()}</h3>
      <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
      {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
    </Card>
  );

  return (
    <div className="p-6 animate-slide-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Creator Dashboard
        </h1>
        <p className="text-text-secondary">
          Manage your content and track your channel's performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Video}
          title="Total Videos"
          value={stats.channelStats.totalVideos}
          subtitle="Active content"
          color="primary"
        />
        <StatCard
          icon={Eye}
          title="Total Views"
          value={stats.channelStats.totalViews}
          subtitle="All-time views"
          color="secondary"
        />
        <StatCard
          icon={Users}
          title="Subscribers"
          value={stats.channelStats.totalSubscribers}
          subtitle="Growing community"
          color="accent"
        />
        <StatCard
          icon={ThumbsUp}
          title="Total Likes"
          value={stats.channelStats.totalLikes}
          subtitle="Audience engagement"
          color="primary"
        />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="!p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Upload New Video</h3>
              <p className="text-text-secondary">Share your latest content with the world</p>
            </div>
          </div>
          <Button className="w-full" onClick={() => window.location.href = '/upload-video'}>
            Create New Video
          </Button>
        </Card>

        <Card className="!p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Analytics</h3>
              <p className="text-text-secondary">Track your channel's performance metrics</p>
            </div>
          </div>
          <Button variant="secondary" className="w-full">
            View Analytics
          </Button>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="!p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <div>
              <p className="font-medium text-text-primary">New video uploaded</p>
              <p className="text-sm text-text-secondary">React Tutorial: Advanced Hooks</p>
            </div>
            <span className="text-xs text-text-muted">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <div>
              <p className="font-medium text-text-primary">Reached 1K subscribers</p>
              <p className="text-sm text-text-secondary">Milestone achieved!</p>
            </div>
            <span className="text-xs text-text-muted">1 day ago</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-text-primary">Video went viral</p>
              <p className="text-sm text-text-secondary">JavaScript Fundamentals hit 10K views</p>
            </div>
            <span className="text-xs text-text-muted">3 days ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;