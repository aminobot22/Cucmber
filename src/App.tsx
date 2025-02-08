import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Zap, Users, Wifi, Gauge ,Cat} from 'lucide-react';
import { AgoraProvider } from './context/AgoraContext';
import { GuestForm } from './components/GuestForm';
import { VideoSelector } from './components/VideoSelector';
import { StreamView } from './components/StreamView';
import { FeatureCard } from './components/FeatureCard';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950 to-black text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGgtNnYxMmg2eiIgc3Ryb2tlPSJyZ2JhKDE0NywgNTEsIDIzNCwgMC4yKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L2c+PC9zdmc+')] opacity-10"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500/20 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '-4s' }}></div>
      </div>
      
      {/* Navigation */}
      <nav className="relative bg-purple-950/50 backdrop-blur-lg border-b border-purple-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-purple-400 animate-glow" />
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Cucumber
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Video Streaming
            </span>
            <br />
            <span className="text-white">
              Reimagined with
            </span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {' '}Bakugo
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the future of video streaming with our cutting-edge platform. 
            Powered by bakugo, high-quality streaming that adapts to your needs.
          </p>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <FeatureCard
              icon={Users}
              title="Guest Access"
              description="Start streaming instantly with no login required. Join channels seamlessly."
            />
            <FeatureCard
              icon={Wifi}
              title="Live Streaming"
              description="Stream or join active channels with ultra-low latency and HD quality."
            />
            <FeatureCard
              icon={Cat}
              title="Pussy-Powered"
              description="Smart automation ensures optimal streaming quality and performance."
            />
            <FeatureCard
              icon={Gauge}
              title="Ultra-Low Latency"
              description="Real-time interaction with near-zero delay for immersive experiences."
            />
          </div>

          {/* CTA Button */}
          <a
            href="/guest"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-4 rounded-full text-lg font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/20 relative group"
          >
            <span className="relative z-10">Try as Guest</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AgoraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/guest" element={<GuestForm />} />
          <Route path="/select-video" element={<VideoSelector />} />
          <Route path="/stream" element={<StreamView />} />
        </Routes>
      </Router>
    </AgoraProvider>
  );
}

export default App