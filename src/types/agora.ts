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