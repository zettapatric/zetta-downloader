
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MusicPlayer from './components/MusicPlayer';
import VideoPlayer from './components/VideoPlayer';
import PlaybackChoiceModal from './components/PlaybackChoiceModal';
import WelcomeModal from './components/WelcomeModal';
import Auth from './pages/Auth';
import Downloader from './pages/Downloader';
import PlaylistsPage from './pages/Playlists';
import ToolsPage from './pages/Tools';
import HelpPage from './pages/Help';
import AccountSettings from './pages/AccountSettings';
import PrivacySecurity from './pages/PrivacySecurity';
import SupportHub from './pages/Support';
import GeneralSettings from './pages/GeneralSettings';
import TermsOfService from './pages/TermsOfService';
import AdminPanel from './pages/Admin';
import Dashboard from './pages/Dashboard';
import TrendingPage from './pages/Trending';
import TopChartsPage from './pages/TopCharts';
import RecommendationsPage from './pages/Recommendations';
import FavoritesPage from './pages/Favorites';
import ArtistsPage from './pages/Artists';
import PlaylistDetailPage from './pages/PlaylistDetail';
import NewsPage from './pages/News';

import { User, MediaItem, Playlist, UserRole } from './types';
import { 
  getStoredLibrary, 
  getStoredPlaylists, 
  getStoredUsers,
  initSystem 
} from './services/mockApi';
import { Icons, STORAGE_KEYS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  const [library, setLibrary] = useState<MediaItem[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  // Playback State
  const [pendingTrack, setPendingTrack] = useState<MediaItem | null>(null);
  const [currentAudioTrack, setCurrentAudioTrack] = useState<MediaItem | null>(null);
  const [currentVideoTrack, setCurrentVideoTrack] = useState<MediaItem | null>(null);
  const [queue, setQueue] = useState<MediaItem[]>([]);

  const refreshCollections = useCallback(() => {
    setLibrary(getStoredLibrary());
    setPlaylists(getStoredPlaylists());
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    setUser(null);
    setIsAuthenticated(false);
    setCurrentAudioTrack(null);
    setCurrentVideoTrack(null);
  }, []);

  const handleLoginSuccess = useCallback((userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    refreshCollections();
  }, [refreshCollections]);

  useEffect(() => {
    initSystem();
    const recoverSession = () => {
      const storedUserJson = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (storedUserJson && token) {
        try {
          const parsedUser = JSON.parse(storedUserJson);
          const allUsers = getStoredUsers();
          const freshUser = allUsers.find(u => u.id === parsedUser.id);
          if (freshUser && freshUser.status === 'active') {
            setUser(freshUser);
            setIsAuthenticated(true);
            setLibrary(getStoredLibrary());
            setPlaylists(getStoredPlaylists());
          }
        } catch (e) {
          handleLogout();
        }
      }
      setIsInitializing(false);
    };
    recoverSession();
    
    const handleLibUpdate = () => setLibrary(getStoredLibrary());
    const handleUserUpdate = () => {
      const storedUserJson = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (storedUserJson) setUser(JSON.parse(storedUserJson));
    };

    window.addEventListener('zetta-library-updated', handleLibUpdate);
    window.addEventListener('zetta-user-updated', handleUserUpdate);
    
    if (!localStorage.getItem('zetta_v3_init')) {
      setShowWelcome(true);
      localStorage.setItem('zetta_v3_init', 'true');
    }

    return () => {
      window.removeEventListener('zetta-library-updated', handleLibUpdate);
      window.removeEventListener('zetta-user-updated', handleUserUpdate);
    };
  }, [handleLogout]);

  const handlePlaybackChoice = (mode: 'audio' | 'video') => {
    if (!pendingTrack) return;
    if (mode === 'audio') {
      setCurrentAudioTrack(pendingTrack);
      setCurrentVideoTrack(null);
      const index = library.findIndex(t => t.id === pendingTrack.id);
      if (index !== -1) setQueue(library.slice(index));
      else setQueue([pendingTrack]);
    } else {
      setCurrentVideoTrack(pendingTrack);
      setCurrentAudioTrack(null);
    }
    setPendingTrack(null);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
         <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
         <p className="text-blue-500 font-bold uppercase tracking-[4px] text-xs">Synchronizing Zetta Node</p>
      </div>
    );
  }

  return (
    <HashRouter>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Auth onLoginSuccess={handleLoginSuccess} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <Layout user={user} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard user={user} library={library} onPlayTrack={setPendingTrack} />} />
            <Route path="/trending" element={<TrendingPage onPlayTrack={setPendingTrack} />} />
            <Route path="/charts" element={<TopChartsPage onPlayTrack={setPendingTrack} />} />
            <Route path="/recommendations" element={<RecommendationsPage onPlayTrack={setPendingTrack} />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/downloader" element={<Downloader onAddMedia={refreshCollections} />} />
            <Route path="/library" element={<Dashboard user={user} library={library} onPlayTrack={setPendingTrack} />} />
            <Route path="/favorites" element={<FavoritesPage onPlayTrack={setPendingTrack} />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/vibes/workout" element={<Dashboard user={user} library={library} vibeType="workout" onPlayTrack={setPendingTrack} />} />
            <Route path="/vibes/chill" element={<Dashboard user={user} library={library} vibeType="chill" onPlayTrack={setPendingTrack} />} />
            <Route path="/playlist/:id" element={<PlaylistDetailPage onPlayTrack={setPendingTrack} />} />
            <Route path="/tools/:toolId" element={<ToolsPage />} />
            <Route path="/account" element={<AccountSettings user={user} onUpdate={setUser} />} />
            <Route path="/settings" element={<GeneralSettings user={user} onUpdate={setUser} />} />
            <Route path="/admin" element={user?.role === UserRole.ADMIN ? <AdminPanel /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}

      {currentAudioTrack && (
        <MusicPlayer 
          currentTrack={currentAudioTrack} 
          queue={queue}
          onNext={() => {}}
          onPrev={() => {}}
          onClose={() => setCurrentAudioTrack(null)}
        />
      )}

      {currentVideoTrack && (
        <VideoPlayer 
          song={currentVideoTrack} 
          onClose={() => setCurrentVideoTrack(null)} 
        />
      )}

      {pendingTrack && (
        <PlaybackChoiceModal 
          song={pendingTrack} 
          onChoose={handlePlaybackChoice} 
          onClose={() => setPendingTrack(null)} 
        />
      )}

      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
    </HashRouter>
  );
};

export default App;
