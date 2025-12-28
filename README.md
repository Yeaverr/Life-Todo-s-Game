# 🎮 Life ToDos Game

A gamified todo app that turns your real-life tasks into quests! Complete quests, earn XP and coins, level up, and use your earnings to buy real-life items from your wishlist.

## ✨ Features

- **Quest System**: Create daily, weekly, monthly, and yearly quests
- **Gamification**: 
  - XP and leveling system
  - Virtual currency (coins) for completing tasks
  - Progress visualization
- **Rewards**: Earn coins by completing quests, then spend them on real-life purchases
- **Statistics**: Track your progress, completion rates, and achievements
- **Beautiful UI**: Modern, responsive design with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Use

1. **Add Quests**: Click "Add Quest" and choose a type (Daily, Weekly, Monthly, or Yearly)
2. **Complete Quests**: Click the circle next to a quest to mark it as complete and earn rewards
3. **Track Progress**: View your level, XP, and coins in the header
4. **Add Purchases**: Add items you want to buy to your wishlist with a coin cost
5. **Buy Items**: Once you have enough coins, purchase items from your wishlist!

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Zustand** - State management with persistence
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 💡 Game Mechanics

- **Daily Quests**: 10 XP, 5 coins
- **Weekly Quests**: 50 XP, 25 coins
- **Monthly Quests**: 200 XP, 100 coins
- **Yearly Quests**: 1000 XP, 500 coins
- **Leveling**: XP requirements increase exponentially (100 × 1.5^level)

## 🎨 Future Enhancements

- Achievement system with badges
- Categories/tags for quests
- Recurring quests
- Data export/import
- Backend integration for cloud sync
- Mobile app version

## 📝 License

MIT

