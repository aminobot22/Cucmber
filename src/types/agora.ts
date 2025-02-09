export interface StreamConfig {
  channelName: string;
  videoFile?: File;
}

export type UserRole = 'host' | 'audience';

export interface AgoraContextType {
  channelName: string;
  setChannelName: (name: string) => void;
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export interface ChatMessage {
  text: string;
  sender: string;
  timestamp: number;
}

export interface ChatProps {
  channelName: string;
  role: UserRole;
}