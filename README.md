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

### Local Development

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ivocreates/blockgame.git
   cd blockgame
   ```

2. **Start Local Server**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. **Open Browser**: Navigate to `http://localhost:8000`

### Deploy to Netlify

#### Option 1: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Option 2: Deploy via Netlify Dashboard
1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select `ivocreates/blockgame`
4. Build settings:
   - **Build command**: Leave empty (or `echo 'Static site'`)
   - **Publish directory**: `.` (root)
5. Click "Deploy site"

#### Option 3: Deploy via Git
1. Push code to GitHub (already done)
2. Netlify will auto-deploy on push if connected

**Live Demo**: Once deployed, your site will be available at: `https://your-site-name.netlify.app`

### Firebase Configuration

⚠️ **IMPORTANT**: Before using the app, you must configure Firebase Realtime Database rules.

The Firebase Realtime Database is already configured, but you need to set up permissions:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **blkchngaw3**
3. Navigate to **Realtime Database** → **Rules**
4. Update rules to allow access (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed instructions)

**Quick Fix for Development:**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

For detailed security options and production rules, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md).

### Environment Variables (Optional)

For production, consider moving API keys to environment variables:
1. In Netlify Dashboard → Site settings → Environment variables
2. Add `FIREBASE_API_KEY` and other sensitive keys
3. Update code to use `process.env.FIREBASE_API_KEY`

## How to Play

1. **Create Profile**: 
   - Enter your full name (2-50 characters, letters only)
   - Provide valid email address
   - Input your grade/standard (8-12)
2. **Solve Problems**: Math challenges tailored to your grade level
3. **Mine Blocks**: Correct answers add blocks to the chain
4. **Earn Points**: Each block increases your score
5. **Compete**: Global leaderboard shows all miners across grades
6. **Change Profile**: Update your details anytime via "Change Profile" button

### Input Validation
- **Name**: 2-50 characters, letters and spaces only
- **Email**: Valid email format (user@domain.com)
- **Grade**: Number between 8 and 12

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
