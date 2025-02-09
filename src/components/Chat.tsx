import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import type { ChatMessage, ChatProps } from '../types/agora';

const WEBSOCKET_URL = 'wss://s14067.blr1.piesocket.com/v3/1?api_key=aO6KCUwgJPZdECSVuZjLRpoDOW2csxyXHznkAuM8&notify_self=1';

export const Chat: React.FC<ChatProps> = ({ channelName, role }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const joinChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !wsRef.current) return;

    const joinMessage = {
      type: 'join',
      channelName,
      userId: username.trim()
    };

    wsRef.current.send(JSON.stringify(joinMessage));
    setIsJoined(true);
  };

  useEffect(() => {
    // Create WebSocket connection
    wsRef.current = new WebSocket(WEBSOCKET_URL);

    wsRef.current.onopen = () => {
      setIsConnected(true);
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      setIsJoined(false);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      setIsJoined(false);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'join') {
          setMessages(prev => [...prev, {
            text: `${data.userId} joined the chat`,
            sender: 'system',
            timestamp: Date.now()
          }]);
        } else if (data.type === 'message' && data.userId !== username) {
          // Only add messages from other users
          setMessages(prev => [...prev, {
            text: data.message,
            sender: data.userId,
            timestamp: data.timestamp
          }]);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [channelName, username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !isConnected || !wsRef.current || !isJoined) return;

    const messageData = {
      type: 'message',
      channelName,
      userId: username,
      message: inputMessage.trim(),
      timestamp: Date.now()
    };

    wsRef.current.send(JSON.stringify(messageData));

    // Add message to local state immediately
    setMessages(prev => [...prev, {
      text: inputMessage.trim(),
      sender: username,
      timestamp: Date.now()
    }]);

    setInputMessage('');
  };

  if (!isJoined) {
    return (
      <div className="bg-purple-900/20 backdrop-blur-xl rounded-xl border border-purple-800/20 p-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-4">Join Chat</h3>
        <form onSubmit={joinChat} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-purple-300 mb-2">
              Choose a username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full bg-purple-900/40 border border-purple-700/50 rounded-lg px-4 py-2 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={!isConnected || !username.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join Chat
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-purple-900/20 backdrop-blur-xl rounded-xl border border-purple-800/20 h-[400px] flex flex-col">
      <div className="p-4 border-b border-purple-800/20">
        <h3 className="text-lg font-semibold text-purple-300">Live Chat</h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
            <span className="text-sm text-purple-400/60">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
          <span className="text-sm text-purple-300">
            Chatting as <span className="font-semibold">{username}</span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.sender === username
                ? 'items-end'
                : msg.sender === 'system'
                ? 'items-center'
                : 'items-start'
            }`}
          >
            {msg.sender !== 'system' && msg.sender !== username && (
              <span className="text-sm text-purple-400/60 ml-3 mb-1">{msg.sender}</span>
            )}
            <div className={`max-w-[80%] rounded-lg p-3 ${
              msg.sender === 'system'
                ? 'bg-purple-900/30 text-purple-300/70'
                : msg.sender === username
                ? 'bg-purple-500/20 text-purple-200'
                : 'bg-blue-500/20 text-blue-200'
            }`}>
              <p className="break-words">{msg.text}</p>
              {msg.sender !== 'system' && (
                <span className="text-xs opacity-60 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-purple-800/20">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-purple-900/40 border border-purple-700/50 rounded-lg px-4 py-2 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!isConnected || !inputMessage.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};