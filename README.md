# MathChain Miner - Blockchain Simulation Game

An educational blockchain game that teaches core blockchain concepts through math challenges for grades 8-12 (Indian curriculum).

## Features

- 🔗 **Interactive Blockchain**: Real-time blockchain visualization showing blocks, hashes, and connections
- 🧮 **Math Challenges**: Grade-appropriate problems in:
  - Algebra
  - Quadratic Equations
  - Geometry
  - Trigonometry
  - Sequences & Series
  - Percentages
  - Powers & Exponents
  - Arithmetic Operations

- ⛏️ **Mining System**: Solve math problems to mine new blocks (Proof of Work)
- 🏆 **Leaderboard**: Real-time rankings of top miners stored in Firebase
- 🤖 **AI Validation**: Powered by Google Gemini AI for answer verification
- 📱 **Responsive Design**: Mobile-friendly with clean, modern UI
- 🎨 **Web3 Theme**: Blockchain-inspired aesthetics with cyan/purple gradients

## Technologies Used

- **Frontend**: Vanilla JavaScript (ES6 Modules), HTML5, CSS3
- **Backend**: Firebase Realtime Database
- **AI**: Google Gemini API
- **Styling**: Custom CSS with responsive design

## Setup Instructions

1. **Clone or Download** the project files

2. **Firebase Setup**:
   - The Firebase configuration is already included
   - Database rules should allow read/write access for development

3. **Gemini API**:
   - The Gemini API key is already configured
   - Used for intelligent answer verification

4. **Run the Application**:
   - Open `index.html` in a modern web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve
     ```

5. **Start Mining**:
   - Enter your miner name
   - Solve the math problem
   - Mine blocks to climb the leaderboard!

## How to Play

1. **Enter Your Name**: Type your miner name in the input field
2. **Read the Problem**: A math challenge will be displayed
3. **Solve It**: Calculate the answer
4. **Submit**: Click "Mine Block" or press Enter
5. **Earn Points**: Correct answers mine new blocks and increase your score
6. **Compete**: Check the leaderboard to see top miners

## Blockchain Concepts Demonstrated

- **Proof of Work**: Solving math problems = computational work
- **Hash Functions**: Each block has a unique hash
- **Chain Integrity**: Blocks linked via previous hash
- **Immutability**: Once mined, blocks cannot be changed
- **Consensus**: All players contribute to the same chain
- **Mining**: Validators (miners) secure the network

## File Structure

```
blkchngame/
├── index.html              # Main HTML structure
├── styles.css              # Styling and responsive design
├── app.js                  # Main application logic
├── blockchain.js           # Blockchain core implementation
├── mathGenerator.js        # Math problem generation
├── firebase-config.js      # Firebase configuration
└── README.md              # This file
```

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Educational Value

This game teaches:
- Blockchain fundamentals in an accessible way
- Problem-solving through math challenges
- Real-time data synchronization
- Web development concepts
- Distributed systems basics

## Future Enhancements

- Difficulty levels (Easy, Medium, Hard)
- Team competitions
- Achievement badges
- Blockchain forking demonstration
- 51% attack simulation
- Smart contract concepts

## License

Free to use for educational purposes.

---

**Powered by Firebase & Google Gemini AI** 🚀
