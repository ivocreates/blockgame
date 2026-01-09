// Leaderboard Page Logic
import { authManager } from './auth.js';
import { FirebaseHelper } from './firebase-config.js';

class LeaderboardPage {
    constructor() {
        this.firebaseHelper = new FirebaseHelper();
        this.currentGradeFilter = 'all';
        this.currentLimit = 10;
        this.init();
    }

    async init() {
        // Check authentication
        if (!authManager.isAuthenticated() && !localStorage.getItem('userId')) {
            window.location.href = 'index.html';
            return;
        }

        this.elements = {
            leaderboardContainer: document.getElementById('leaderboardContainer'),
            gradeFilter: document.getElementById('gradeFilter'),
            limitFilter: document.getElementById('limitFilter'),
            refreshBtn: document.getElementById('refreshBtn'),
            logoutBtn: document.getElementById('logoutBtn')
        };

        this.setupEventListeners();
        await this.loadLeaderboard();

        // Set up real-time updates
        this.firebaseHelper.onLeaderboardUpdate((leaderboard) => {
            this.displayLeaderboard(leaderboard);
        }, this.currentLimit);
    }

    setupEventListeners() {
        this.elements.gradeFilter.addEventListener('change', (e) => {
            this.currentGradeFilter = e.target.value;
            this.loadLeaderboard();
        });

        this.elements.limitFilter.addEventListener('change', (e) => {
            this.currentLimit = parseInt(e.target.value);
            this.loadLeaderboard();
        });

        this.elements.refreshBtn.addEventListener('click', () => {
            this.loadLeaderboard();
        });

        this.elements.logoutBtn.addEventListener('click', async () => {
            await authManager.signOutUser();
            window.location.href = 'index.html';
        });
    }

    async loadLeaderboard() {
        this.elements.leaderboardContainer.innerHTML = '<div class="loading">Loading...</div>';
        const leaderboard = await this.firebaseHelper.getLeaderboard(this.currentLimit);
        this.displayLeaderboard(leaderboard);
    }

    displayLeaderboard(leaderboard) {
        // Filter by grade if needed
        let filteredLeaderboard = leaderboard;
        if (this.currentGradeFilter !== 'all') {
            filteredLeaderboard = leaderboard.filter(miner => 
                miner.grade === parseInt(this.currentGradeFilter)
            );
        }

        if (filteredLeaderboard.length === 0) {
            this.elements.leaderboardContainer.innerHTML = '<div class="loading">No miners found</div>';
            return;
        }

        this.elements.leaderboardContainer.innerHTML = `
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Miner</th>
                        <th>Grade</th>
                        <th>Blocks Mined</th>
                        <th>Last Active</th>
                    </tr>
                </thead>
                <tbody id="leaderboardBody">
                </tbody>
            </table>
        `;

        const tbody = document.getElementById('leaderboardBody');
        
        filteredLeaderboard.forEach((miner, index) => {
            const rank = index + 1;
            let rankClass = '';
            let rankDisplay = rank;
            
            if (rank === 1) {
                rankClass = 'gold';
                rankDisplay = '🥇';
            } else if (rank === 2) {
                rankClass = 'silver';
                rankDisplay = '🥈';
            } else if (rank === 3) {
                rankClass = 'bronze';
                rankDisplay = '🥉';
            }

            const row = document.createElement('tr');
            row.className = rankClass;
            row.innerHTML = `
                <td class="rank-cell"><span class="rank-badge ${rankClass}">${rankDisplay}</span></td>
                <td class="name-cell">
                    <div class="miner-avatar">${miner.name.charAt(0).toUpperCase()}</div>
                    <span class="miner-name">${miner.name}</span>
                </td>
                <td><span class="grade-badge">Grade ${miner.grade}</span></td>
                <td class="blocks-cell">${miner.blocksMined}</td>
                <td class="date-cell">${new Date(miner.lastMined).toLocaleString('en-IN', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LeaderboardPage();
    });
} else {
    new LeaderboardPage();
}
