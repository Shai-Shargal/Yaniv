# Yaniv Card Game

A modern, web-based implementation of the popular Yaniv card game built with React, TypeScript, and Tailwind CSS.

## 🎮 About Yaniv

Yaniv is a card game where players try to get the lowest score possible. Players take turns drawing and discarding cards, trying to form the best hand. The game ends when a player reaches 100 points or more, and the player with the lowest score wins.

## ✨ Features

- **Multi-player support**: Play with 2-16 players
- **Real-time scoring**: Automatic score calculation and penalty tracking
- **Game history**: Track all rounds and player progress
- **Responsive design**: Works on desktop and mobile devices
- **Dark mode**: Toggle between light and dark themes
- **Persistent storage**: Game state is saved locally
- **Drag & drop**: Reorder players easily
- **Settings customization**: Adjust game rules and preferences

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Yaniv
```

2. Navigate to the app directory:

```bash
cd yaniv-app
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Play

1. **Add Players**: Enter player names and add them to the game (minimum 2, maximum 16)
2. **Start Round**: Begin a new round when ready
3. **Enter Scores**: Input each player's card sum for the round
4. **Call Yaniv**: Select which player called "Yaniv"
5. **View Results**: See penalties, eliminations, and updated scores
6. **Continue**: Play continues until someone reaches 100+ points

## 🛠️ Built With

- **Frontend**: React 18 with TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest
- **Code Quality**: ESLint

## 📁 Project Structure

```
yaniv-app/
├── src/
│   ├── components/          # React components
│   ├── lib/                 # Game logic and utilities
│   ├── store.ts            # State management
│   └── main.tsx            # Application entry point
├── public/                  # Static assets
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 🏗️ Building for Production

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by the classic Yaniv card game
- Built with modern web technologies for the best user experience
- Special thanks to the React and Tailwind CSS communities
