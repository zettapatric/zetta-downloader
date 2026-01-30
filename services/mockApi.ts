
import { User, UserRole, MediaItem, Playlist, SupportTicket, Session, AppSettings, AdminAnalytics, AuditLog } from '../types';
import { STORAGE_KEYS } from '../constants';

const DEFAULT_SETTINGS: AppSettings = {
  notifications: true,
  inAppNotifications: true,
  language: 'English',
  theme: 'dark',
  downloadFormat: 'mp3',
  downloadQuality: '320',
  autoMetadata: true
};

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'SynthWave Pro',
    duration: 245,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    thumbnail: 'https://picsum.photos/seed/music1/400/400',
    format: 'mp3',
    size: 5242880,
    isFavorite: true,
    downloadDate: new Date().toISOString(),
    tags: ['Synth', 'Chill']
  },
  {
    id: '2',
    title: 'Digital Horizon',
    artist: 'Cyber Stream',
    duration: 180,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    thumbnail: 'https://picsum.photos/seed/music2/400/400',
    format: 'mp3',
    size: 4242880,
    isFavorite: false,
    downloadDate: new Date().toISOString(),
    tags: ['Future', 'Beat']
  }
];

export const getStoredLibrary = (): MediaItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.LIBRARY);
  return data ? JSON.parse(data) : INITIAL_MEDIA;
};

export const saveLibrary = (items: MediaItem[]) => {
  localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(items));
};

export const getStoredPlaylists = (): Playlist[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
  return data ? JSON.parse(data) : [];
};

export const savePlaylists = (playlists: Playlist[]) => {
  localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
};

export const createPlaylist = (name: string, description: string): Playlist => {
  const playlists = getStoredPlaylists();
  const newPlaylist: Playlist = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    description,
    coverImage: `https://picsum.photos/seed/${Math.random()}/400/400`,
    itemIds: [],
    createdAt: new Date().toISOString()
  };
  savePlaylists([...playlists, newPlaylist]);
  return newPlaylist;
};

export const deletePlaylist = (id: string) => {
  const playlists = getStoredPlaylists();
  savePlaylists(playlists.filter(p => p.id !== id));
};

export const addItemToPlaylist = (playlistId: string, mediaId: string) => {
  const playlists = getStoredPlaylists();
  const updated = playlists.map(p => {
    if (p.id === playlistId && !p.itemIds.includes(mediaId)) {
      return { ...p, itemIds: [...p.itemIds, mediaId] };
    }
    return p;
  });
  savePlaylists(updated);
};

export const removeItemFromPlaylist = (playlistId: string, mediaId: string) => {
  const playlists = getStoredPlaylists();
  const updated = playlists.map(p => {
    if (p.id === playlistId) {
      return { ...p, itemIds: p.itemIds.filter(id => id !== mediaId) };
    }
    return p;
  });
  savePlaylists(updated);
};

export const mockLogin = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password.length >= 6) {
        const user: User = {
          id: 'u1',
          username: email.split('@')[0],
          email,
          role: UserRole.ADMIN,
          avatar: `https://ui-avatars.com/api/?name=${email}&background=random`,
          createdAt: new Date().toISOString(),
          plan: 'premium',
          settings: { ...DEFAULT_SETTINGS }
        };
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'mock-jwt-token-xyz');
        addAuditLog(user.id, 'User Login', 'San Francisco, US');
        resolve(user);
      } else {
        reject(new Error("Invalid credentials. Password must be at least 6 characters."));
      }
    }, 800);
  });
};

export const mockRegister = async (email: string, password: string): Promise<User> => {
  return mockLogin(email, password);
};

export const updateUserData = async (updates: Partial<User>): Promise<User> => {
  const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA) || '{}');
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updated));
  return updated;
};

export const saveAppSettings = async (settings: AppSettings): Promise<AppSettings> => {
  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA) || '{}');
  user.settings = settings;
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  return settings;
};

export const getAuditLogs = (): AuditLog[] => {
  const logs = localStorage.getItem('zetta_audit_logs');
  return logs ? JSON.parse(logs) : [];
};

export const addAuditLog = (userId: string, action: string, location: string = 'Unknown') => {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    action,
    timestamp: new Date().toISOString(),
    ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
    location
  };
  localStorage.setItem('zetta_audit_logs', JSON.stringify([newLog, ...logs].slice(0, 500)));
  return newLog;
};

export const insertAuditLog = (log: AuditLog) => {
  const logs = getAuditLogs();
  localStorage.setItem('zetta_audit_logs', JSON.stringify([log, ...logs]));
};

export const updateAuditLog = (id: string, updates: Partial<AuditLog>) => {
  const logs = getAuditLogs();
  const updated = logs.map(l => l.id === id ? { ...l, ...updates } : l);
  localStorage.setItem('zetta_audit_logs', JSON.stringify(updated));
};

export const deleteAuditLog = (id: string) => {
  const logs = getAuditLogs();
  const filtered = logs.filter(l => l.id !== id);
  localStorage.setItem('zetta_audit_logs', JSON.stringify(filtered));
};

export const getAdminAnalytics = (): AdminAnalytics => {
  const logs = getAuditLogs();
  return {
    dailyLogins: [
      { date: '2023-10-24', count: 120 },
      { date: '2023-10-25', count: 145 },
      { date: '2023-10-26', count: 132 },
      { date: '2023-10-27', count: 168 },
      { date: '2023-10-28', count: 190 }
    ],
    dailyDownloads: [
      { date: '2023-10-24', count: 450 },
      { date: '2023-10-25', count: 520 },
      { date: '2023-10-26', count: 480 },
      { date: '2023-10-27', count: 610 },
      { date: '2023-10-28', count: 700 }
    ],
    mostDownloaded: [
      { title: 'Neon Nights', count: 1204 },
      { title: 'Cyber Pulse', count: 945 },
      { title: 'Retro Vibes', count: 870 }
    ],
    mostSearched: [
      { query: 'Lo-fi', count: 2400 },
      { query: 'Phonk', count: 1800 },
      { query: 'Synthwave', count: 1550 }
    ],
    totalLogins: logs.filter(l => l.action.toLowerCase().includes('login')).length,
    totalSystemEvents: logs.length
  };
};

export const getMockSessions = (): Session[] => [
  { id: 's1', device: 'Chrome / Windows 11', location: 'San Francisco, US', lastActive: 'Now', current: true },
  { id: 's2', device: 'Safari / iPhone 14', location: 'New York, US', lastActive: '2 hours ago', current: false },
];

export const submitSupportTicket = async (subject: string, message: string): Promise<SupportTicket> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        subject,
        message,
        status: 'open',
        createdAt: new Date().toISOString(),
      });
    }, 1000);
  });
};
