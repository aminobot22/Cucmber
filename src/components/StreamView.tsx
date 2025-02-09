import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC, { IAgoraRTCClient, ILocalVideoTrack, ILocalAudioTrack } from 'agora-rtc-sdk-ng';
import { useAgora } from '../context/AgoraContext';
import { Play, Pause, Volume2, VolumeX, Maximize2, Video, VideoOff,Mic,MicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Chat } from './Chat';

const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

export const StreamView: React.FC = () => {
  const navigate = useNavigate();
  const { channelName, videoFile, role } = useAgora();
  const videoRef = useRef<any>(null);
  const localTrackRef = useRef<ILocalVideoTrack | null>(null);
  const localAudioTrackRef = useRef<ILocalAudioTrack | null>(null);
  const remoteVideoRef = useRef<any>(null);
  const mountedRef = useRef(true);
  const connectionAttemptRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  // UI States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const [localTracks, setLocalTracks] = useState<{
    screenVideoTrack: ILocalVideoTrack | null;
    audioTrack: ILocalAudioTrack | null;
    screenAudioTrack: ILocalAudioTrack | null;
  }>({
    screenVideoTrack: null,
    audioTrack: null,
    screenAudioTrack: null,
  });

  // Validate channel name before attempting connection
  useEffect(() => {
    if (!channelName.trim()) {
      navigate('/guest');
    }
  }, [channelName, navigate]);

  // Connection management
  const setupConnection = async () => {
    if (connectionAttemptRef.current || client.connectionState !== 'DISCONNECTED') return false;
  
    connectionAttemptRef.current = true;
    setError(null);
  
    try {
      await client.join(
        import.meta.env.VITE_AGORA_APP_ID,
        channelName,
        null,
        null
      );
      if (role === 'audience'){
        const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack({
          encoderConfig: 'speech_standard',
          AEC: true,
          ANS: true,
        });
        await client.publish([ microphoneTrack]);

        setIsMicMuted(true)
        setLocalTracks(prev => ({
          ...prev,
          audioTrack: microphoneTrack,
        }));
      }
        return true;
    } catch (error: any) {
      console.error('Connection error:', error);
      setError('Failed to connect. Please try again.');
      return false;
    } finally {
      connectionAttemptRef.current = false;
    }
  };

  // Host streaming setup
  const setupHostStream = async () => {
    if (!videoRef.current || !videoFile) return false;

    try {
      const videoElement = videoRef.current;
      videoElement.src = URL.createObjectURL(videoFile);
      videoElement.muted = isMuted;
      

      await new Promise<void>((resolve) => {
        const handleMetadata = () => {
          videoElement.removeEventListener('loadedmetadata', handleMetadata);
          resolve();
        };
        videoElement.addEventListener('loadedmetadata', handleMetadata);
      });

      if (!mountedRef.current) return false;

      const mediaStream = videoElement.captureStream();
      
      // Create and publish video track
      const customVideoTrack = AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack: mediaStream.getVideoTracks()[0],
      });

      // Create and publish audio track
      const customAudioTrack = AgoraRTC.createCustomAudioTrack({
        mediaStreamTrack: mediaStream.getAudioTracks()[0],
      });

      localTrackRef.current = customVideoTrack;
      localAudioTrackRef.current = customAudioTrack;
      
      const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: 'speech_standard',
        AEC: true,
        ANS: true,
      });

      // Publish all tracks
      await client.publish([customVideoTrack, customAudioTrack, microphoneTrack]);

      // Update state with new tracks
      setLocalTracks(prev => ({
        ...prev,
        audioTrack: microphoneTrack,
      }));

      try {
        await videoElement.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to autoplay:', error);
        setIsPlaying(false);
      }

      return true;
    } catch (error) {
      console.error('Host setup error:', error);
      return false;
    }
  };

  // Audience streaming setup
  const setupAudienceStream = () => {
    const handleUserPublished = async (user: any, mediaType: any) => {
      try {
        await client.subscribe(user, mediaType);
        
        if (mediaType === 'video' && remoteVideoRef.current) {
          user.videoTrack?.play(remoteVideoRef.current);
        }
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      } catch (error) {
        console.error('Subscribe error:', error);
      }
    };

    const handleUserUnpublished = (user: any, mediaType: string) => {
      if (mediaType === 'video') {
        user.videoTrack?.stop();
      }
      if (mediaType === 'audio') {
        user.audioTrack?.stop();
      }
    };

    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
    };
  };

  // Cleanup function
  const cleanup = async () => {
    try {
      // Stop and unpublish local tracks
      if (localTrackRef.current) {
        localTrackRef.current.stop();
        localTrackRef.current.close();
        localTrackRef.current = null;
      }

      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }

      if (localTracks.audioTrack) {
        localTracks.audioTrack.stop();
        localTracks.audioTrack.close();
      }

      setLocalTracks({
        screenVideoTrack: null,
        audioTrack: null,
        screenAudioTrack: null,
      });

      // Leave the channel if connected
      if (client.connectionState === 'CONNECTED') {
        try {
          await client.unpublish();
        } catch (error) {
          console.error('Unpublish error:', error);
        }
        try {
          await client.leave();
        } catch (error) {
          console.error('Leave error:', error);
        }
      }

      // Reset UI states if component is still mounted
      if (mountedRef.current) {
        setIsLive(false);
        setIsConnecting(false);
        setIsPlaying(false);
        setError(null);
        setIsMicMuted(false);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  };

  // Main streaming logic
  const startStream = async () => {
    if (isConnecting || connectionAttemptRef.current) return;
    if (role === 'host' && (!videoFile || !videoRef.current)) return;

    try {
      setIsConnecting(true);
      
      const connected = await setupConnection();
      if (!connected || !mountedRef.current) {
        await cleanup();
        return;
      }

      let streamSetup = false;
      if (role === 'host') {
        streamSetup = await setupHostStream();
      } else {
        setupAudienceStream();
        streamSetup = true;
      }

      if (mountedRef.current && streamSetup) {
        setIsLive(true);
      } else {
        await cleanup();
      }
    } catch (error: any) {
      console.error('Stream error:', error);
      await cleanup();
    } finally {
      if (mountedRef.current) {
        setIsConnecting(false);
      }
    }
  };

  // Component lifecycle
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, []);
  
  useEffect(() => {
    if (!isConnecting && !connectionAttemptRef.current) {
      startStream();
    }
  }, [channelName, videoFile, role]);

  // Video controls
  const togglePlay = () => {
    if (role !== 'host' || !videoRef.current || !isLive) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (role !== 'host' || !videoRef.current || !isLive) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleMicMute = () => {
    if (!localTracks.audioTrack) return;
    
    try {
      localTracks.audioTrack.setEnabled(!isMicMuted);
      setIsMicMuted(!isMicMuted);
    } catch (error) {
      console.error('Failed to toggle microphone:', error);
    }
  };

  const toggleFullscreen = () => {
    const videoElement = role === 'host' ? videoRef.current : remoteVideoRef.current;
    if (!videoElement) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoElement.requestFullscreen();
    }
  };

  // Audience controls
  const toggleAudioMute = () => {
    if (role !== 'audience' || !isLive) return;
    const remoteUsers = client.remoteUsers;
    remoteUsers.forEach(user => {
      if (user.audioTrack) {
        if (isMuted) {
          user.audioTrack.play();
        } else {
          user.audioTrack.stop();
        }
      }
    });
    setIsMuted(!isMuted);
  };

  const toggleVideoMute = () => {
    if (role !== 'audience' || !isLive) return;
    const remoteUsers = client.remoteUsers;
    remoteUsers.forEach(user => {
      if (user.videoTrack) {
        if (isVideoMuted) {
          user.videoTrack.play(remoteVideoRef.current);
        } else {
          user.videoTrack.stop();
        }
      }
    });
    setIsVideoMuted(!isVideoMuted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950 to-black p-4">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Channel: {channelName}
          </h1>
          <div className="flex items-center mt-2">
            {isConnecting ? (
              <>
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse mr-2"></div>
                <span className="text-yellow-400 text-sm font-medium">Connecting...</span>
              </>
            ) : isLive ? (
              <>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></div>
                <span className="text-red-400 text-sm font-medium">LIVE</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
                <span className="text-gray-400 text-sm font-medium">Offline</span>
              </>
            )}
          </div>
        </div>

        <div className="relative group">
          {role === 'host' ? (
            <video
              ref={videoRef}
              className="w-full aspect-video rounded-xl bg-purple-900/20"
              controls={false}
              playsInline
            />
          ) : (
            <video
              ref={remoteVideoRef}
              className="w-full aspect-video rounded-xl bg-purple-900/20"
              controls={false}
              playsInline
            />
          )}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-4">
              {role === 'host' ? (
                <>
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors"
                    disabled={!isLive}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors"
                    disabled={!isLive}
                  >
                    {isMuted ? (
                      <VolumeX className="w-6 h-6 text-white" />
                    ) : (
                      <Volume2 className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <button
                    onClick={toggleMicMute}
                    className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors"
                    disabled={!isLive}
                  >
                    {isMicMuted ? (
                      <Mic className="w-6 h-6 text-white" />
                    ) : (
                      <MicOff className="w-6 h-6 text-white" />
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={toggleVideoMute}
                    className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors"
                    disabled={!isLive}
                  >
                    {isVideoMuted ? (
                      <VideoOff className="w-6 h-6 text-white" />
                    ) : (
                      <Video className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <button
                    onClick={toggleAudioMute}
                    className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors"
                    disabled={!isLive}
                  >
                    {isMuted ? (
                      <VolumeX className="w-6 h-6 text-white" />
                    ) : (
                      <Volume2 className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <button
                    onClick={toggleMicMute}
                    className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors"
                    disabled={!isLive}
                  >
                    {isMicMuted ? (
                      <Mic className="w-6 h-6 text-white" />
                    ) : (
                      <MicOff className="w-6 h-6 text-white" />
                    )}
                  </button>
                </>
              )}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors"
                disabled={!isLive}
              >
                <Maximize2 className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-purple-900/20 backdrop-blur-xl rounded-xl border border-purple-800/20">
          <h2 className="text-xl font-semibold text-purple-300">Stream Settings</h2>
          <p className="text-purple-400/60 mt-1">
            {isConnecting ? 'Connecting to channel...' : 
             isLive ? `${role === 'host' ? 'Broadcasting' : 'Watching'} live stream` : 
             'Waiting to connect...'}
          </p>
        </div>

        <div className="mt-4">
          <Chat channelName={channelName} role={role} />
        </div>
      </div>
    </div>
  );
};