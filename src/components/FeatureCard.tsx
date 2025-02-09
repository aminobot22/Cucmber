import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: typeof LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="group relative p-6 bg-purple-900/10 backdrop-blur-xl rounded-xl border border-purple-800/20 transition-all duration-300 hover:bg-purple-900/20">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative">
        <Icon className="w-8 h-8 text-purple-400 mb-4 group-hover:text-pink-400 transition-colors" />
        <h3 className="text-lg font-semibold text-purple-100 mb-2">{title}</h3>
        <p className="text-purple-300/70 text-sm">{description}</p>
      </div>
    </div>
  );
};