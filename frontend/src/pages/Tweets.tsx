import { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { MessageSquare, Heart, Edit3, Trash2, Send } from "lucide-react";
import { tweetApi, likeApi, authApi } from "../services/api";
import type { Tweet, User } from "../types/api";
import { useToast } from "../hooks/use-toast.ts";

function Tweets() {
  const { toast } = useToast();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newTweetContent, setNewTweetContent] = useState("");
  const [editingTweet, setEditingTweet] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const fetchUserAndTweets = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          return;
        }

        // Get current user
        const userResponse = await authApi.getCurrentUser();
        if (userResponse.success) {
          setCurrentUser(userResponse.data);
          
          // Get user's tweets
          const tweetsResponse = await tweetApi.getUserTweets(userResponse.data._id);
          if (tweetsResponse.success) {
            setTweets(tweetsResponse.data);
          }
        }
      } catch (error: any) {
        console.error("Failed to fetch tweets:", error);
        toast({
          title: "Error",
          description: "Failed to load tweets.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndTweets();
  }, []);

  const handleCreateTweet = async () => {
    if (!newTweetContent.trim()) {
      toast({
        title: "Empty Tweet",
        description: "Please enter some content for your tweet.",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    try {
      const response = await tweetApi.createTweet(newTweetContent.trim());
      if (response.success) {
        setTweets(prev => [response.data, ...prev]);
        setNewTweetContent("");
        toast({
          title: "Tweet Posted!",
          description: "Your tweet has been posted successfully.",
        });
      }
    } catch (error: any) {
      console.error("Failed to create tweet:", error);
      toast({
        title: "Post Failed",
        description: error.response?.data?.message || "Failed to post tweet.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleEditTweet = async (tweetId: string) => {
    if (!editContent.trim()) {
      toast({
        title: "Empty Content",
        description: "Please enter some content for your tweet.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await tweetApi.updateTweet(tweetId, editContent.trim());
      if (response.success) {
        setTweets(prev => prev.map(tweet => 
          tweet._id === tweetId ? response.data : tweet
        ));
        setEditingTweet(null);
        setEditContent("");
        toast({
          title: "Tweet Updated",
          description: "Your tweet has been updated successfully.",
        });
      }
    } catch (error: any) {
      console.error("Failed to update tweet:", error);
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update tweet.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTweet = async (tweetId: string) => {
    if (!confirm("Are you sure you want to delete this tweet?")) return;

    try {
      const response = await tweetApi.deleteTweet(tweetId);
      if (response.success) {
        setTweets(prev => prev.filter(tweet => tweet._id !== tweetId));
        toast({
          title: "Tweet Deleted",
          description: "Your tweet has been deleted successfully.",
        });
      }
    } catch (error: any) {
      console.error("Failed to delete tweet:", error);
      toast({
        title: "Delete Failed",
        description: error.response?.data?.message || "Failed to delete tweet.",
        variant: "destructive",
      });
    }
  };

  const handleLikeTweet = async (tweetId: string) => {
    try {
      await likeApi.toggleTweetLike(tweetId);
      // Note: In a real app, you'd update the like count and status in the UI
      toast({
        title: "Like Toggled",
        description: "Tweet like status updated.",
      });
    } catch (error: any) {
      console.error("Failed to toggle like:", error);
      toast({
        title: "Like Failed",
        description: "Failed to update like status.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="h-32 animate-pulse">
              <div className="w-full h-full bg-surface-light rounded-lg"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="text-center max-w-md">
          <div className="text-6xl mb-4">🐦</div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Sign In Required</h2>
          <p className="text-text-secondary mb-4">
            Please log in to view and post tweets.
          </p>
          <a href="/auth" className="btn-primary">
            Sign In
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 animate-slide-up">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            My Tweets
          </h1>
          <p className="text-text-secondary">
            Share your thoughts with the EchoPlay community
          </p>
        </div>

        {/* Create Tweet */}
        <Card className="!p-6 mb-8">
          <div className="flex space-x-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={newTweetContent}
                onChange={(e) => setNewTweetContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-3 bg-surface-light border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                rows={3}
                maxLength={280}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-text-muted">
                  {newTweetContent.length}/280
                </span>
                <Button
                  onClick={handleCreateTweet}
                  disabled={isPosting || !newTweetContent.trim()}
                  className="flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isPosting ? "Posting..." : "Tweet"}</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Tweets List */}
        {tweets.length > 0 ? (
          <div className="space-y-6">
            {tweets.map((tweet, index) => (
              <div key={tweet._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card className="!p-6">
                <div className="flex space-x-4">
                  <img
                    src={tweet.owner.avatar}
                    alt={tweet.owner.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-text-primary">
                          {tweet.owner.fullName}
                        </h3>
                        <p className="text-sm text-text-muted">
                          @{tweet.owner.username} • {formatDate(tweet.createdAt)}
                        </p>
                      </div>
                      {tweet.owner._id === currentUser._id && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingTweet(tweet._id);
                              setEditContent(tweet.content);
                            }}
                            className="p-2 text-text-muted hover:text-primary transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTweet(tweet._id)}
                            className="p-2 text-text-muted hover:text-error transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {editingTweet === tweet._id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-3 bg-surface-light border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                          rows={3}
                          maxLength={280}
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-text-muted">
                            {editContent.length}/280
                          </span>
                          <div className="space-x-2">
                            <Button
                              variant="secondary"
                              onClick={() => {
                                setEditingTweet(null);
                                setEditContent("");
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleEditTweet(tweet._id)}
                              disabled={!editContent.trim()}
                            >
                              Update
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-text-primary mb-4 whitespace-pre-wrap">
                          {tweet.content}
                        </p>

                        <div className="flex items-center space-x-6">
                          <button
                            onClick={() => handleLikeTweet(tweet._id)}
                            className="flex items-center space-x-2 text-text-muted hover:text-error transition-colors"
                          >
                            <Heart className="w-5 h-5" />
                            <span className="text-sm">Like</span>
                          </button>
                          <div className="flex items-center space-x-2 text-text-muted">
                            <MessageSquare className="w-5 h-5" />
                            <span className="text-sm">Reply</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐦</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No tweets yet</h3>
            <p className="text-text-secondary">
              Share your first thought with the community!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tweets;