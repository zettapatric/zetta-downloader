
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  CONTENT_MANAGER = 'CONTENT_MANAGER'
}

export type GenreType = 'CHILL' | 'WORKOUT' | 'LOVE' | 'PARTY' | 'TIKTOK SOUNDS' | 'DJ PACKS' | 'REELS';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  plan: 'free' | 'pro' | 'premium';
  settings?: AppSettings;
  status: 'active' | 'suspended';
  affinity: Record<string, number>;
  stats?: {
    totalDownloads: number;
    totalFavorites: number;
  }
}

export interface MediaItem {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre: GenreType;
  year?: string;
  duration: number;
  url: string;
  thumbnail: string;
  format: 'mp3' | 'mp4' | 'wav';
  size: number;
  isFavorite: boolean;
  isVisible: boolean;
  downloadDate: string;
  downloadCount: number;
  favoriteCount: number;
  playCount: number;
  details?: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  bio: string;
  stats: string;
  image: string;
  officialLink: string;
  socials?: { twitter?: string; instagram?: string; youtube?: string };
}

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  itemIds: string[];
  createdAt: string;
}

export interface AppSettings {
  notifications: boolean;
  inAppNotifications: boolean;
  language: string;
  theme: 'dark' | 'light';
  preferredFormat: 'mp3' | 'mp4';
  preferredAudioQuality: '128' | '320';
  preferredVideoQuality: '360' | '720' | '1080';
  autoMetadata: boolean;
}

export interface AdminAnalytics {
  genreTrends: Record<string, number>;
  activeUsers: number;
  totalStorage: number;
  bandwidthUsage: number;
  totalDownloads: number;
  totalFavorites: number;
  growthRate: number;
  dailyActiveUsers: number[];
  recentEvents: { action: string; timestamp: string; user: string }[];
}

export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  timestamp: string;
  ip: string;
  location: string;
  details?: string;
}

export interface DownloadTask {
  id: string;
  url: string;
  title: string;
  status: 'downloading' | 'completed' | 'failed';
  progress: number;
}
