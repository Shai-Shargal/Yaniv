# Yaniv Mobile App

A React Native mobile application for the Yaniv card game, built with Expo.

## 🎮 About Yaniv

Yaniv is a popular card game where players try to get the lowest score possible. The game ends when all players except one are eliminated (score above 100 points).

## 🚀 Features

- **Player Management**: Add, edit, and remove players (up to 8)
- **Round Scoring**: Enter hand sums and calculate penalties
- **Game Logic**: Automatic elimination when players exceed 100 points
- **Game History**: Track rounds and view game progress
- **Persistent Storage**: Save game state between sessions
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **Zustand** - State management
- **React Navigation** - Screen navigation
- **AsyncStorage** - Local data persistence

## 📱 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shai-Shargal/Yaniv.git
   cd Yaniv/yaniv-app/yaniv-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Scan QR code with Expo Go app (physical device)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

## 🎯 How to Play

1. **Add Players**: Enter player names (minimum 2, maximum 8)
2. **Start Round**: Begin a new round
3. **Select Yaniv Caller**: Choose who called "Yaniv"
4. **Enter Hand Sums**: Input the card values for each player
5. **Calculate Results**: View penalties and score updates
6. **Continue Playing**: Repeat until someone wins

## 🏆 Game Rules

- **Objective**: Get the lowest score possible
- **Elimination**: Players are eliminated when their score exceeds 100
- **Milestones**: Exact scores of 50 or 100 reset to 0
- **Winner**: Last remaining player wins the game

## 📁 Project Structure

```
yaniv-mobile/
├── app/                 # Expo Router screens
├── src/
│   ├── components/      # React components
│   ├── lib/            # Game logic and utilities
│   └── store.ts        # Zustand state management
├── assets/             # Images and static files
├── app.json           # Expo configuration
└── package.json       # Dependencies
```

## 🔧 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser
- `npm run build` - Build for production

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component-based architecture

## 📱 Platform Support

- ✅ iOS (iPhone, iPad)
- ✅ Android (Phone, Tablet)
- ✅ Web (Browser)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Game logic inspired by traditional Yaniv rules
- UI components designed for mobile-first experience

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Shai-Shargal/Yaniv/issues) page
2. Create a new issue with detailed information
3. Include device type, OS version, and error messages

---

**Happy Gaming! 🎉**
