
import React from 'react';

export const APP_NAME = "Zetta Downloader";
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'zetta_token',
  USER_DATA: 'zetta_user',
  LIBRARY: 'zetta_library',
  PLAYLISTS: 'zetta_playlists'
};

export const Icons = {
  Dashboard: () => <i className="fa-solid fa-house"></i>,
  Downloader: () => <i className="fa-solid fa-cloud-arrow-down"></i>,
  Library: () => <i className="fa-solid fa-music"></i>,
  Playlists: () => <i className="fa-solid fa-list-ul"></i>,
  Tools: () => <i className="fa-solid fa-screwdriver-wrench"></i>,
  Admin: () => <i className="fa-solid fa-user-shield"></i>,
  Settings: () => <i className="fa-solid fa-gear"></i>,
  Logout: () => <i className="fa-solid fa-right-from-bracket"></i>,
  // Fix: Redefine Favorite as a component to correctly handle 'filled' prop
  Favorite: ({ filled }: { filled?: boolean }) => <i className={`fa-${filled ? 'solid' : 'regular'} fa-heart ${filled ? 'text-red-500' : ''}`}></i>,
  Play: () => <i className="fa-solid fa-play"></i>,
  Pause: () => <i className="fa-solid fa-pause"></i>,
  Next: () => <i className="fa-solid fa-forward-step"></i>,
  Prev: () => <i className="fa-solid fa-backward-step"></i>,
  Repeat: () => <i className="fa-solid fa-repeat"></i>,
  Shuffle: () => <i className="fa-solid fa-shuffle"></i>,
  Volume: () => <i className="fa-solid fa-volume-high"></i>,
  Close: () => <i className="fa-solid fa-xmark"></i>,
  Plus: () => <i className="fa-solid fa-plus"></i>,
};
