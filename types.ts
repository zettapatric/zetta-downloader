
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  plan: 'free' | 'pro' | 'premium';
  settings?: AppSettings;
}

export interface MediaItem {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  url: string;
  thumbnail: string;
  format: 'mp3' | 'mp4' | 'wav';
  size: number; // in bytes
  isFavorite: boolean;
  downloadDate: string;
  tags?: string[];
  source?: 'zetta' | 'youtube';
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  itemIds: string[];
  createdAt: string;
}

export interface DownloadTask {
  id: string;
  url: string;
  status: 'pending' | 'analyzing' | 'downloading' | 'completed' | 'failed';
  progress: number;
  title?: string;
  error?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'closed';
  createdAt: string;
  userEmail?: string;
}

export interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface AppSettings {
  notifications: boolean;
  inAppNotifications: boolean;
  language: string;
  theme: 'dark' | 'light';
  downloadFormat: 'mp3' | 'mp4' | 'wav';
  downloadQuality: '128' | '320' | 'lossless';
  autoMetadata: boolean;
}

export interface AdminAnalytics {
  dailyLogins: { date: string; count: number }[];
  dailyDownloads: { date: string; count: number }[];
  mostDownloaded: { title: string; count: number }[];
  mostSearched: { query: string; count: number }[];
  totalLogins: number;
  totalSystemEvents: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  ip: string;
  location: string;
}
