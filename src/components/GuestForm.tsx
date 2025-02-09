import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgora } from '../context/AgoraContext';
import { UserRole } from '../types/agora';

const CHANNEL_NAME_REGEX = /^[a-zA-Z0-9!#$%&()+\-:;<=>?@[\]^_{}|~,\s]{1,64}$/;

export const GuestForm: React.FC = () => {
  const [inputChannel, setInputChannel] = useState('');
  const [error, setError] = useState('');
  const { setChannelName, role, setRole } = useAgora();
  const navigate = useNavigate();

  const validateChannelName = (name: string): boolean => {
    if (!name.trim()) {
      setError('Channel name cannot be empty');
      return false;
    }
    if (!CHANNEL_NAME_REGEX.test(name)) {
      setError('Channel name can only contain letters, numbers, and common symbols. Max length is 64 characters.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedChannel = inputChannel.trim();
    if (validateChannelName(trimmedChannel)) {
      setChannelName(trimmedChannel);
      navigate(role === 'host' ? '/select-video' : '/stream');
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
  };

  const handleChannelInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputChannel(value);
    if (value) {
      validateChannelName(value);
    } else {
      setError('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-950 via-blue-950 to-black p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-purple-900/20 backdrop-blur-xl p-8 rounded-xl border border-purple-800/20">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Join Channel
          </h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="channel" className="block text-sm font-medium text-purple-300 mb-2">
                Channel Name
              </label>
              <input
                type="text"
                id="channel"
                value={inputChannel}
                onChange={handleChannelInput}
                className={`w-full px-4 py-2 bg-purple-900/40 border ${error ? 'border-red-500' : 'border-purple-700/50'} rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-purple-500'} focus:border-transparent`}
                placeholder="Enter channel name"
                required
              />
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Join As
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="radio"
                    checked={role === 'host'}
                    onChange={() => handleRoleChange('host')}
                    className="w-4 h-4 text-pink-500 bg-purple-900/40 border-purple-700/50 focus:ring-pink-500"
                  />
                  <span className="text-purple-300 group-hover:text-purple-200">Host</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="radio"
                    checked={role === 'audience'}
                    onChange={() => handleRoleChange('audience')}
                    className="w-4 h-4 text-pink-500 bg-purple-900/40 border-purple-700/50 focus:ring-pink-500"
                  />
                  <span className="text-purple-300 group-hover:text-purple-200">Audience</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!!error}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};