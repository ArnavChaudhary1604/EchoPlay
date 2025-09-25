// API Response Types based on backend models
export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  watchHistory: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface Tweet {
  _id: string;
  content: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  video: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  _id: string;
  video?: string;
  comment?: string;
  tweet?: string;
  likedBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  _id: string;
  subscriber: User;
  channel: User;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  _id: string;
  name: string;
  description: string;
  videos: Video[];
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  fullName: string;
  password: string;
  avatar: File;
  coverImage?: File;
}

export interface VideoUploadRequest {
  title: string;
  description: string;
  videoFile: File;
  thumbnail: File;
}

export interface DashboardStats {
  totalVideos: number;
  totalViews: number;
  totalSubscribers: number;
  totalLikes: number;
  channelStats: {
    totalVideos: number;
    totalViews: number;
    totalSubscribers: number;
    totalLikes: number;
  };
}