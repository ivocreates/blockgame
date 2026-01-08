// Main Application Logic
import { Blockchain, Block } from './blockchain.js';
import { MathProblemGenerator } from './mathGenerator.js';
import { FirebaseHelper } from './firebase-config.js';
import { authManager } from './auth.js';

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyBVRMdnmJQjpmrUaR6-36iKVErihuMrkto';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

class MathChainApp {
    constructor() {
        this.blockchain = new Blockchain();
        this.mathGenerator = new MathProblemGenerator(10);
        this.firebaseHelper = new FirebaseHelper();
        this.currentProblem = null;
        this.userScore = 0;
        this.userProfile = null;
        
        this.init();
    }

    async init() {
        // Check authentication
        if (!authManager.isAuthenticated() && !localStorage.getItem('userId')) {
            window.location.href = 'index.html';
            return;
        }

        // Initialize UI elements
        this.elements = {
            navLogoutBtn: document.getElementById('navLogoutBtn'),
            profileModal: document.getElementById('profileModal'),
            profileForm: document.getElementById('profileForm'),
            profileName: document.getElementById('profileName'),
            profileEmail: document.getElementById('profileEmail'),
            profileGrade: document.getElementById('profileGrade'),
            displayName: document.getElementById('displayName'),
            displayEmail: document.getElementById('displayEmail'),
            userAvatar: document.getElementById('userAvatar'),
            userGrade: document.getElementById('userGrade'),
            changeProfileBtn: document.getElementById('changeProfileBtn'),
            minerName: document.getElementById('minerName'),
            problemDisplay: document.getElementById('problemDisplay'),
            answerInput: document.getElementById('answerInput'),
            mineBtn: document.getElementById('mineBtn'),
            feedback: document.getElementById('feedback'),
            chainLength: document.getElementById('chainLength'),
            userScore: document.getElementById('userScore'),
            blockchainContainer: document.getElementById('blockchainContainer'),
            leaderboardContainer: document.getElementById('leaderboardContainer'),
            difficultyBadge: document.getElementById('difficultyBadge')
        };

        // Set up event listeners
        this.setupEventListeners();

        // Check for existing profile
        await this.loadUserProfile();

        // Load leaderboard
        this.loadLeaderboard();

        // Set up real-time leaderboard updates
        this.firebaseHelper.onLeaderboardUpdate((leaderboard) => {
            this.displayLeaderboard(leaderboard);
        });
    }

    async loadUserProfile() {
        const userId = localStorage.getItem('userId');
        
        if (userId) {
            this.userProfile = await this.firebaseHelper.getUserProfile(userId);
            
            if (this.userProfile) {
                this.updateUIWithProfile();
                this.mathGenerator.setGrade(this.userProfile.grade);
                this.generateNewProblem();
                this.renderBlockchain();
                return;
            }
        }
        
        // Show profile modal if no profile
        this.showProfileModal();
    }

    showProfileModal() {
        this.elements.profileModal.style.display = 'flex';
    }

    hideProfileModal() {
        this.elements.profileModal.style.display = 'none';
    }

    updateUIWithProfile() {
        this.elements.displayName.textContent = this.userProfile.name;
        this.elements.displayEmail.textContent = this.userProfile.email;
        this.elements.userGrade.textContent = this.userProfile.grade;
        this.elements.userAvatar.textContent = this.userProfile.name.charAt(0).toUpperCase();
        
        // Update stored miner name
        this.elements.minerName.value = this.userProfile.name;
    }

    async createUserProfile(name, email, grade) {
        // Generate unique user ID
        const userId = this.generateUserId(email);
        
        const profileData = {
            userId: userId,
            name: name,
            email: email,
            grade: parseInt(grade),
            blocksMined: 0,
            createdAt: new Date().toISOString()
        };

        const success = await this.firebaseHelper.saveUserProfile(userId, profileData);
        
        if (success) {
            localStorage.setItem('userId', userId);
            this.userProfile = profileData;
            this.updateUIWithProfile();
            this.mathGenerator.setGrade(grade);
            this.hideProfileModal();
            this.generateNewProblem();
            this.renderBlockchain();
        }
        
        return success;
    }

    generateUserId(email) {
        // Simple hash of email for user ID
        return email.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString(36);
    }

    setupEventListeners() {
        // Logout button
        if (this.elements.navLogoutBtn) {
            this.elements.navLogoutBtn.addEventListener('click', async () => {
                await authManager.signOutUser();
                window.location.href = 'index.html';
            });
        }

        // Profile form submission
        this.elements.profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = this.elements.profileName.value.trim();
            const email = this.elements.profileEmail.value.trim();
            const grade = parseInt(this.elements.profileGrade.value);
            
            // Validate inputs
            const validation = this.validateProfileInputs(name, email, grade);
            if (!validation.valid) {
                this.showFeedback(validation.message, 'error');
                return;
            }
            
            if (name && email && grade) {
                const success = await this.createUserProfile(name, email, grade);
                if (!success) {
                    this.showFeedback('Failed to create profile. Please try again.', 'error');
                }
            }
        });

        // Change profile button
        this.elements.changeProfileBtn.addEventListener('click', () => {
            this.showProfileModal();
        });

        // Mine button click
        this.elements.mineBtn.addEventListener('click', () => this.mineBlock());

        // Enter key to mine
        this.elements.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.mineBlock();
            }
        });
    }

    validateProfileInputs(name, email, grade) {
        // Validate name
        if (!name || name.length < 2) {
            return { valid: false, message: 'Name must be at least 2 characters long.' };
        }
        if (name.length > 50) {
            return { valid: false, message: 'Name must be less than 50 characters.' };
        }
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return { valid: false, message: 'Name should only contain letters and spaces.' };
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return { valid: false, message: 'Please enter a valid email address.' };
        }

        // Validate grade
        if (isNaN(grade) || grade < 8 || grade > 12) {
            return { valid: false, message: 'Grade must be a number between 8 and 12.' };
        }

        return { valid: true };
    }

    generateNewProblem() {
        this.currentProblem = this.mathGenerator.generateProblem();
        this.elements.problemDisplay.textContent = this.currentProblem.question;
        this.elements.difficultyBadge.textContent = this.currentProblem.type;
        this.elements.answerInput.value = '';
        this.elements.answerInput.focus();
    }

    async mineBlock() {
        if (!this.userProfile) {
            this.showFeedback('Please create a profile first!', 'error');
            return;
        }

        const minerName = this.userProfile.name;
        const userAnswer = this.elements.answerInput.value.trim();

        // Validation
        if (!userAnswer) {
            this.showFeedback('Please enter an answer!', 'error');
            return;
        }

        // Disable button while processing
        this.elements.mineBtn.disabled = true;
        this.elements.mineBtn.innerHTML = '<span>Validating...</span>';

        // Verify answer using Gemini AI
        const isCorrect = await this.verifyAnswerWithGemini(
            this.currentProblem.question,
            userAnswer,
            this.currentProblem.answer
        );

        if (isCorrect) {
            // Create new block
            const newBlock = new Block(
                this.blockchain.chain.length,
                new Date().toISOString(),
                `Block mined by ${minerName}`,
                this.blockchain.getLatestBlock().hash,
                minerName,
                this.currentProblem.question,
                userAnswer
            );

            // Add block to chain
            this.blockchain.addBlock(newBlock);

            // Update score
            this.userScore++;
            this.elements.userScore.textContent = this.userScore;
            this.elements.chainLength.textContent = this.blockchain.chain.length;

            // Save to Firebase
            await this.firebaseHelper.saveMinerScore(
                this.userProfile.userId,
                minerName,
                this.userProfile.grade,
                1
            );

            // Show success feedback
            this.showFeedback('✅ Correct! Block mined successfully!', 'success');

            // Render updated blockchain
            this.renderBlockchain();

            // Generate new problem
            setTimeout(() => {
                this.generateNewProblem();
            }, 1500);
        } else {
            // Show error feedback
            this.showFeedback(`❌ Incorrect answer. Try again! (Correct: ${this.currentProblem.answer})`, 'error');
        }

        // Re-enable button
        this.elements.mineBtn.disabled = false;
        this.elements.mineBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.7 6.3L19 10.6L9 20.6L2 22L3.4 15L13.4 5C13.6 4.8 13.9 4.7 14.1 4.7C14.3 4.7 14.6 4.8 14.7 5L14.7 6.3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Mine Block
        `;
    }

    async verifyAnswerWithGemini(question, userAnswer, correctAnswer) {
        // First check locally
        if (this.mathGenerator.checkAnswer(userAnswer)) {
            return true;
        }

        // If local check fails, use Gemini for additional verification
        try {
            const prompt = `Given the math problem: "${question}"
The student answered: ${userAnswer}
The expected answer is: ${correctAnswer}

Is the student's answer correct? Consider numerical equivalence and rounding to 2 decimal places.
Respond with only "YES" or "NO".`;

            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            const data = await response.json();
            const aiResponse = data.candidates[0].content.parts[0].text.trim().toUpperCase();
            
            return aiResponse.includes('YES');
        } catch (error) {
            console.error('Gemini API error:', error);
            // Fallback to strict local check
            return Math.abs(parseFloat(userAnswer) - correctAnswer) < 0.01;
        }
    }

    showFeedback(message, type) {
        this.elements.feedback.textContent = message;
        this.elements.feedback.className = `feedback show ${type}`;

        setTimeout(() => {
            this.elements.feedback.classList.remove('show');
        }, 3000);
    }

    renderBlockchain() {
        const chain = this.blockchain.getChainData();
        this.elements.blockchainContainer.innerHTML = '';

        chain.forEach((block, index) => {
            const blockEl = document.createElement('div');
            blockEl.className = `block ${index === 0 ? 'genesis' : ''}`;

            const timeStr = new Date(block.timestamp).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
            });

            blockEl.innerHTML = `
                <div class="block-header">
                    <span class="block-number">Block #${block.index}</span>
                    <span class="block-time">${timeStr}</span>
                </div>
                <div class="block-info">
                    <div class="block-label">Hash</div>
                    <div class="block-value">${block.hash}</div>
                </div>
                <div class="block-info">
                    <div class="block-label">Previous Hash</div>
                    <div class="block-value">${block.previousHash}</div>
                </div>
                ${block.problem ? `
                    <div class="block-info">
                        <div class="block-label">Problem</div>
                        <div class="block-value">${block.problem}</div>
                    </div>
                ` : ''}
                <div class="block-miner">⛏️ Mined by: ${block.miner}</div>
            `;

            this.elements.blockchainContainer.appendChild(blockEl);
        });

        // Scroll to latest block
        this.elements.blockchainContainer.scrollLeft = this.elements.blockchainContainer.scrollWidth;
    }

    async loadLeaderboard() {
        const leaderboard = await this.firebaseHelper.getLeaderboard(10);
        this.displayLeaderboard(leaderboard);
    }

    displayLeaderboard(leaderboard) {
        if (leaderboard.length === 0) {
            this.elements.leaderboardContainer.innerHTML = '<div class="loading">No miners yet. Be the first!</div>';
            return;
        }

        this.elements.leaderboardContainer.innerHTML = '';

        leaderboard.forEach((miner, index) => {
            const rank = index + 1;
            let rankClass = 'regular';
            if (rank === 1) rankClass = 'gold';
            else if (rank === 2) rankClass = 'silver';
            else if (rank === 3) rankClass = 'bronze';

            const itemEl = document.createElement('div');
            itemEl.className = 'leaderboard-item';
            itemEl.innerHTML = `
                <div class="rank ${rankClass}">${rank}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${miner.name}</div>
                    <div class="leaderboard-score">
                        Grade ${miner.grade} • Last: ${new Date(miner.lastMined).toLocaleDateString('en-IN')}
                    </div>
                </div>
                <div class="leaderboard-blocks">${miner.blocksMined}</div>
            `;

            this.elements.leaderboardContainer.appendChild(itemEl);
        });
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MathChainApp();
    });
} else {
    new MathChainApp();
}

export { MathChainApp };
