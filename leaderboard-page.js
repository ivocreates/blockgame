// Leaderboard Page Logic
import { authManager } from './auth.js';
import { FirebaseHelper } from './firebase-config.js';

class LeaderboardPage {
    constructor() {
        this.firebaseHelper = new FirebaseHelper();
        this.currentGradeFilter = 'all';
        this.currentPage = 1;
        this.itemsPerPage = 25;
        this.allMiners = [];
        this.init();
    }

    async init() {
        // Leaderboard is public - no authentication required
        const isAuthenticated = authManager.isAuthenticated() || localStorage.getItem('userId');

        this.elements = {
            leaderboardContainer: document.getElementById('leaderboardContainer'),
            gradeFilter: document.getElementById('gradeFilter'),
            itemsPerPageFilter: document.getElementById('itemsPerPageFilter'),
            refreshBtn: document.getElementById('refreshBtn'),
            logoutBtn: document.getElementById('logoutBtn'),
            paginationContainer: document.getElementById('paginationContainer')
        };

        // Hide logout button if not authenticated
        if (!isAuthenticated && this.elements.logoutBtn) {
            this.elements.logoutBtn.style.display = 'none';
        }

        this.setupEventListeners();
        await this.loadLeaderboard();

        // Set up real-time updates
        setInterval(async () => {
            await this.loadLeaderboard(false);
        }, 30000); // Refresh every 30 seconds
    }

    setupEventListeners() {
        this.elements.gradeFilter.addEventListener('change', (e) => {
            this.currentGradeFilter = e.target.value;
            this.currentPage = 1;
            this.displayCurrentPage();
        });

        this.elements.itemsPerPageFilter.addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.displayCurrentPage();
        });

        this.elements.refreshBtn.addEventListener('click', () => {
            this.loadLeaderboard();
        });

        if (this.elements.logoutBtn) {
            this.elements.logoutBtn.addEventListener('click', async () => {
                await authManager.signOutUser();
                window.location.href = 'index.html';
            });
        }
    }

    async loadLeaderboard(showLoading = true) {
        if (showLoading) {
            this.elements.leaderboardContainer.innerHTML = '<div class="loading">Loading all miners...</div>';
        }
        this.allMiners = await this.firebaseHelper.getAllMiners();
        this.displayCurrentPage();
    }

    getFilteredMiners() {
        // Filter by grade if needed
        if (this.currentGradeFilter === 'all') {
            return this.allMiners;
        }
        return this.allMiners.filter(miner => 
            miner.grade === parseInt(this.currentGradeFilter)
        );
    }

    displayCurrentPage() {
        const filteredMiners = this.getFilteredMiners();
        
        if (filteredMiners.length === 0) {
            this.elements.leaderboardContainer.innerHTML = '<div class="loading">No miners found</div>';
            this.elements.paginationContainer.innerHTML = '';
            return;
        }

        // Calculate pagination
        const totalPages = Math.ceil(filteredMiners.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageMiners = filteredMiners.slice(startIndex, endIndex);

        this.displayLeaderboard(pageMiners, filteredMiners, startIndex);
        this.displayPagination(totalPages, filteredMiners.length);
    }

    displayLeaderboard(pageMiners, allFilteredMiners, startIndex) {
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
        
        pageMiners.forEach((miner, index) => {
            const globalRank = startIndex + index + 1;
            let rankClass = '';
            let rankDisplay = globalRank;
            
            if (globalRank === 1) {
                rankClass = 'gold';
                rankDisplay = '🥇';
            } else if (globalRank === 2) {
                rankClass = 'silver';
                rankDisplay = '🥈';
            } else if (globalRank === 3) {
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

    displayPagination(totalPages, totalMiners) {
        if (totalPages <= 1) {
            this.elements.paginationContainer.innerHTML = `
                <div class="pagination-info">
                    Showing all ${totalMiners} miner${totalMiners !== 1 ? 's' : ''}
                </div>
            `;
            return;
        }

        let paginationHTML = `
            <div class="pagination-info">
                Showing ${(this.currentPage - 1) * this.itemsPerPage + 1}-${Math.min(this.currentPage * this.itemsPerPage, totalMiners)} of ${totalMiners} miners
            </div>
            <div class="pagination-controls">
        `;

        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="${this.currentPage - 1}">← Previous</button>`;
        }

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === this.currentPage ? 'active' : '';
            paginationHTML += `<button class="pagination-btn ${activeClass}" data-page="${i}">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" data-page="${this.currentPage + 1}">Next →</button>`;
        }

        paginationHTML += `</div>`;
        
        this.elements.paginationContainer.innerHTML = paginationHTML;

        // Add event listeners to pagination buttons
        this.elements.paginationContainer.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentPage = parseInt(btn.dataset.page);
                this.displayCurrentPage();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
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
