# StreamVerse

StreamVerse is a modern, real-time video streaming platform built with React, TypeScript, and Agora SDK. It features a beautiful, responsive UI with a focus on user experience and performance.

![StreamVerse](https://images.unsplash.com/photo-1626379953822-baec19c3accd?auto=format&fit=crop&q=80&w=2000&h=600)

## Features

- **Live Video Streaming**: High-quality, low-latency video streaming
- **Dual Roles**: Support for both hosts and audience members
- **Real-time Audio**: Synchronized audio streaming with video
- **Interactive Controls**: 
  - Play/Pause functionality
  - Audio muting
  - Fullscreen mode
- **Beautiful UI**: Modern, gradient-based design with smooth animations
- **Responsive Design**: Works seamlessly across all device sizes
- **Real-time Status**: Live connection and streaming status indicators

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Streaming SDK**: Agora RTC
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Agora Account and App ID

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd streamverse
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Agora App ID:
```env
VITE_AGORA_APP_ID=your-app-id-here
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # React components
│   ├── FeatureCard.tsx
│   ├── GuestForm.tsx
│   ├── StreamView.tsx
│   └── VideoSelector.tsx
├── context/            # React context providers
│   └── AgoraContext.tsx
├── types/              # TypeScript type definitions
│   └── agora.ts
├── App.tsx            # Main application component
└── main.tsx          # Application entry point
```

## Usage

### As a Host

1. Click "Try as Guest" on the landing page
2. Enter a channel name
3. Select "Host" role
4. Choose a video file to stream
5. Use the video controls to manage your stream:
   - Play/Pause
   - Mute/Unmute
   - Toggle Fullscreen

### As an Audience Member

1. Click "Try as Guest" on the landing page
2. Enter the channel name you want to join
3. Select "Audience" role
4. Watch the stream with fullscreen control

## Features in Detail

### Video Streaming
- Custom video track creation from file input
- Real-time video streaming using Agora SDK
- Automatic quality adaptation

### Audio Streaming
- Synchronized audio with video
- Independent audio track management
- Muting capabilities

### User Interface
- Gradient-based design system
- Animated backgrounds
- Interactive hover states
- Status indicators for connection states

### Connection Management
- Automatic connection handling
- Error recovery
- Clean disconnection handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Agora.io](https://www.agora.io/) for their excellent streaming SDK
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icons