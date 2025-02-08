import React, { createContext, useState, useContext } from 'react';
import { AgoraContextType, UserRole } from '../types/agora';

const AgoraContext = createContext<AgoraContextType | undefined>(undefined);

export const AgoraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [channelName, setChannelName] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [role, setRole] = useState<UserRole>('host');

  return (
    <AgoraContext.Provider value={{ 
      channelName, 
      setChannelName, 
      videoFile, 
      setVideoFile,
      role,
      setRole
    }}>
      {children}
    </AgoraContext.Provider>
  );
};

export const useAgora = () => {
  const context = useContext(AgoraContext);
  if (context === undefined) {
    throw new Error('useAgora must be used within an AgoraProvider');
  }
  return context;
};