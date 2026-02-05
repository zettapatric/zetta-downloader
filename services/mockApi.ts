
import { User, UserRole, MediaItem, Playlist, AppSettings, AdminAnalytics, AuditLog, GenreType, Artist, NewsArticle } from '../types';
import { STORAGE_KEYS } from '../constants';

const USERS_KEY = 'zetta_users_collection';
const AUDIT_LOGS_KEY = 'zetta_audit_logs';
const ARTISTS_KEY = 'zetta_artists_registry';
const NEWS_KEY = 'zetta_news_registry';
const FAST_TRACK_KEY = 'zetta_fast_track_queue';

const DEFAULT_SETTINGS: AppSettings = {
  notifications: true,
  inAppNotifications: true,
  language: 'English',
  theme: 'dark',
  preferredFormat: 'mp3',
  preferredAudioQuality: '320',
  preferredVideoQuality: '1080',
  autoMetadata: true
};

export const initSystem = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const admin: User = {
      id: 'admin-root',
      username: 'ZettaAdmin',
      email: 'admin@zetta.io',
      role: UserRole.ADMIN,
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=4a4aff&color=fff',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      plan: 'premium',
      status: 'active',
      settings: { ...DEFAULT_SETTINGS },
      affinity: {},
      stats: { totalDownloads: 45, totalFavorites: 12 }
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([admin]));
  }
  
  if (!localStorage.getItem(ARTISTS_KEY)) {
    const initialArtists: Artist[] = [
      {
        id: 'a1',
        name: 'Bruce Melodie',
        genre: 'Afro-beat',
        bio: 'The New King of Rwandan music.',
        stats: '1.2M+ Monthly Pulse',
        image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=600',
        officialLink: '#',
      }
    ];
    localStorage.setItem(ARTISTS_KEY, JSON.stringify(initialArtists));
  }

  if (!localStorage.getItem(NEWS_KEY)) {
    const initialNews: NewsArticle[] = [
      {
        id: 'n1',
        title: "Bruce Melodie Announces World Tour",
        category: "Global Update",
        date: "2 hours ago",
        image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800",
        excerpt: "The Rwandan superstar is set to headline a tour.",
        content: "Detailed content about the tour goes here."
      }
    ];
    localStorage.setItem(NEWS_KEY, JSON.stringify(initialNews));
  }
};

export const getStoredUsers = (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
export const getStoredLibrary = (): MediaItem[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.LIBRARY) || '[]');
export const getStoredArtists = (): Artist[] => JSON.parse(localStorage.getItem(ARTISTS_KEY) || '[]');
export const getStoredNews = (): NewsArticle[] => JSON.parse(localStorage.getItem(NEWS_KEY) || '[]');

// Fast Track (Queue) Management
export interface FastTrackItem {
  id: string;
  title: string;
  url: string;
  timestamp: number;
}

export const getFastTrackItems = (): FastTrackItem[] => JSON.parse(localStorage.getItem(FAST_TRACK_KEY) || '[]');

export const saveFastTrackItems = (items: FastTrackItem[]) => {
  localStorage.setItem(FAST_TRACK_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('zetta-fast-track-updated'));
};

export const addFastTrackItem = (item: FastTrackItem) => {
  const current = getFastTrackItems();
  saveFastTrackItems([item, ...current]);
};

export const removeFastTrackItem = (id: string) => {
  const current = getFastTrackItems();
  saveFastTrackItems(current.filter(i => i.id !== id));
};

export const logAudit = (userId: string, action: string, type: string = 'System') => {
  const users = getStoredUsers();
  const user = users.find(u => u.id === userId) || { username: userId };
  const logs: AuditLog[] = JSON.parse(localStorage.getItem(AUDIT_LOGS_KEY) || '[]');
  logs.unshift({
    id: 'log-' + Date.now(),
    userId,
    username: user.username,
    action,
    timestamp: new Date().toISOString(),
    ip: '197.243.1.1',
    location: 'Zetta Command Hub',
    details: type
  });
  localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs.slice(0, 100)));
  window.dispatchEvent(new Event('zetta-logs-updated'));
};

export const toggleUserStatus = (userId: string) => {
  const users = getStoredUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    users[idx].status = users[idx].status === 'active' ? 'suspended' : 'active';
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    logAudit('Admin', `User Status Updated: ${users[idx].username} set to ${users[idx].status}`, 'Governance');
  }
};

export const deleteUser = (id: string) => {
  const users = getStoredUsers().filter(u => u.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  logAudit('Admin', `User node terminated: ${id}`, 'Governance');
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event('zetta-user-updated'));
};

export const deleteMediaItem = (id: string) => {
  const lib = getStoredLibrary().filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(lib));
  window.dispatchEvent(new Event('zetta-library-updated'));
  logAudit('Admin', `Media node purged: ${id}`, 'Content');
};

export const addMediaItem = (item: MediaItem) => {
  const lib = getStoredLibrary();
  const updated = [item, ...lib];
  localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(updated));
  window.dispatchEvent(new Event('zetta-library-updated'));
  logAudit('Admin', `New Media Node Injected: ${item.title}`, 'Content');
};

export const updateMediaItem = (id: string, updates: Partial<MediaItem>) => {
  const lib = getStoredLibrary();
  const idx = lib.findIndex(i => i.id === id);
  if (idx !== -1) {
    lib[idx] = { ...lib[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(lib));
    window.dispatchEvent(new Event('zetta-library-updated'));
  }
};

export const resetMediaStats = (id?: string) => {
  const lib = getStoredLibrary();
  const updated = lib.map(item => (!id || item.id === id ? { ...item, downloadCount: 0, favoriteCount: 0, playCount: 0 } : item));
  localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(updated));
  window.dispatchEvent(new Event('zetta-library-updated'));
};

export const deleteArtist = (id: string) => {
  const artists = getStoredArtists().filter(a => a.id !== id);
  localStorage.setItem(ARTISTS_KEY, JSON.stringify(artists));
  window.dispatchEvent(new Event('zetta-artists-updated'));
};

export const saveArtists = (artists: Artist[]) => {
  localStorage.setItem(ARTISTS_KEY, JSON.stringify(artists));
  window.dispatchEvent(new Event('zetta-artists-updated'));
};

export const addArtist = (artist: Artist) => {
  const current = getStoredArtists();
  saveArtists([artist, ...current]);
  logAudit('Admin', `New Creator Node Deployed: ${artist.name}`, 'Content');
};

export const deleteNews = (id: string | number) => {
  const news = getStoredNews().filter(n => n.id !== id);
  localStorage.setItem(NEWS_KEY, JSON.stringify(news));
  window.dispatchEvent(new Event('zetta-news-updated'));
  logAudit('Admin', `Broadcast node terminated: ${id}`, 'Signal');
};

export const saveNews = (news: NewsArticle[]) => {
  localStorage.setItem(NEWS_KEY, JSON.stringify(news));
  window.dispatchEvent(new Event('zetta-news-updated'));
};

export const addNews = (article: NewsArticle) => {
  const current = getStoredNews();
  saveNews([article, ...current]);
  logAudit('Admin', `Broadcast Signal Transmitted: ${article.title}`, 'Signal');
};

export const getAdminAnalytics = (): AdminAnalytics => {
  const lib = getStoredLibrary();
  const users = getStoredUsers();
  return {
    genreTrends: {},
    activeUsers: users.length,
    totalStorage: lib.reduce((acc, curr) => acc + curr.size, 0),
    bandwidthUsage: 450.2, 
    totalDownloads: lib.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0),
    totalFavorites: lib.reduce((acc, curr) => acc + (curr.favoriteCount || 0), 0),
    growthRate: 15.4,
    dailyActiveUsers: [45, 52, 68, 72, 85, 95, 120], 
    recentEvents: []
  };
};

export const getAuditLogs = (): AuditLog[] => JSON.parse(localStorage.getItem(AUDIT_LOGS_KEY) || '[]');

export const triggerDirectDownload = (item: MediaItem, format?: string) => {
  const lib = getStoredLibrary();
  const idx = lib.findIndex(i => i.id === item.id);
  if (idx !== -1) {
    lib[idx].downloadCount = (lib[idx].downloadCount || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(lib));
    window.dispatchEvent(new Event('zetta-library-updated'));
  }
};

export const getStoredPlaylists = (): Playlist[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYLISTS) || '[]');

export const mockLogin = async (email: string, pass: string): Promise<User> => {
  const users = getStoredUsers();
  const user = users.find(u => u.email === email);
  if (!user) throw new Error("Entity signature not found.");
  user.lastLogin = new Date().toISOString();
  localStorage.setItem(USERS_KEY, JSON.stringify(users.map(u => u.id === user.id ? user : u)));
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'zetta-token-' + Date.now());
  return user;
};

export const mockRegister = async (email: string, pass: string, name: string): Promise<User> => {
  const users = getStoredUsers();
  const newUser: User = { id: 'u-' + Date.now(), username: name, email, role: UserRole.USER, avatar: `https://ui-avatars.com/api/?name=${name}`, createdAt: new Date().toISOString(), plan: 'free', status: 'active', affinity: {} };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser));
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'zetta-token-' + Date.now());
  return newUser;
};

export const logSearch = (query: string) => {
  logAudit('System', `Search performed: ${query}`, 'Search');
};

export const savePlaylists = (playlists: Playlist[]) => {
  localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
  window.dispatchEvent(new Event('zetta-playlists-updated'));
};

export const deletePlaylist = (id: string) => {
  const playlists = getStoredPlaylists().filter(p => p.id !== id);
  savePlaylists(playlists);
  logAudit('Admin', `Playlist node purged: ${id}`, 'Content');
};

export const trackPlayback = (genre: string) => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (userData) {
    const user: User = JSON.parse(userData);
    if (!user.affinity) user.affinity = {};
    user.affinity[genre] = (user.affinity[genre] || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    saveUsers(getStoredUsers().map(u => u.id === user.id ? user : u));
  }
};

export const updateUserData = async (data: { username: string; email: string }): Promise<User> => {
  const storedUserJson = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!storedUserJson) throw new Error("No user session.");
  const user: User = JSON.parse(storedUserJson);
  user.username = data.username;
  user.email = data.email;
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  saveUsers(getStoredUsers().map(u => u.id === user.id ? user : u));
  return user;
};

export const updateUserAvatar = (userId: string, avatar: string) => {
  const users = getStoredUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    users[idx].avatar = avatar;
    saveUsers(users);
    const current = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (current) {
      const u = JSON.parse(current);
      if (u.id === userId) {
        u.avatar = avatar;
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(u));
      }
    }
  }
};

export const getMockSessions = () => [
  { id: 's1', device: 'iPhone 15 Pro', location: 'Kigali, RW', lastActive: 'Just now', current: true },
  { id: 's2', device: 'MacBook Pro', location: 'Kigali, RW', lastActive: '2 hours ago', current: false }
];

export const submitSupportTicket = async (subject: string, message: string) => {
  console.debug("Support Ticket:", subject, message);
  await new Promise(resolve => setTimeout(resolve, 800));
};

export const saveAppSettings = async (settings: AppSettings): Promise<AppSettings> => {
  const storedUserJson = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!storedUserJson) throw new Error("No user session.");
  const user: User = JSON.parse(storedUserJson);
  user.settings = settings;
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  saveUsers(getStoredUsers().map(u => u.id === user.id ? user : u));
  return settings;
};

export const addItemToPlaylist = (playlistId: string, itemId: string) => {
  const playlists = getStoredPlaylists();
  const idx = playlists.findIndex(p => p.id === playlistId);
  if (idx !== -1) {
    if (!playlists[idx].itemIds.includes(itemId)) {
      playlists[idx].itemIds.push(itemId);
      savePlaylists(playlists);
    }
  }
};
