import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgora } from '../context/AgoraContext';
import { Upload } from 'lucide-react';

export const VideoSelector: React.FC = () => {
  const { setVideoFile } = useAgora();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      navigate('/stream');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-950 via-blue-950 to-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-purple-900/20 backdrop-blur-xl p-8 rounded-xl border border-purple-800/20">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Select Video
          </h2>
          <div className="space-y-4">
            <label className="block w-full">
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-full h-48 border-2 border-dashed border-purple-700/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 transition-colors">
                  <Upload className="w-12 h-12 text-purple-400 mb-2" />
                  <span className="text-purple-300">Click to select video</span>
                  <span className="text-purple-400/60 text-sm mt-1">Supported formats: MP4, WebM</span>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};