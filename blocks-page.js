// Blocks History Page Logic
import { authManager } from './auth.js';
import { Blockchain } from './blockchain.js';

class BlocksPage {
    constructor() {
        this.blockchain = new Blockchain();
        this.allBlocks = [];
        this.filteredBlocks = [];
        this.init();
    }

    async init() {
        // Check authentication
        if (!authManager.isAuthenticated() && !localStorage.getItem('userId')) {
            window.location.href = 'index.html';
            return;
        }

        this.elements = {
            blocksContainer: document.getElementById('blocksContainer'),
            searchMiner: document.getElementById('searchMiner'),
            refreshBlocksBtn: document.getElementById('refreshBlocksBtn'),
            logoutBtn: document.getElementById('logoutBtn'),
            totalBlocks: document.getElementById('totalBlocks'),
            totalMiners: document.getElementById('totalMiners'),
            chainValid: document.getElementById('chainValid')
        };

        this.setupEventListeners();
        this.loadBlocks();
    }

    setupEventListeners() {
        this.elements.searchMiner.addEventListener('input', (e) => {
            this.filterBlocks(e.target.value);
        });

        this.elements.refreshBlocksBtn.addEventListener('click', () => {
            this.loadBlocks();
        });

        this.elements.logoutBtn.addEventListener('click', async () => {
            await authManager.signOutUser();
            window.location.href = 'index.html';
        });
    }

    loadBlocks() {
        this.allBlocks = this.blockchain.getChainData();
        this.filteredBlocks = [...this.allBlocks];
        this.updateStats();
        this.displayBlocks();
    }

    filterBlocks(searchTerm) {
        if (!searchTerm) {
            this.filteredBlocks = [...this.allBlocks];
        } else {
            this.filteredBlocks = this.allBlocks.filter(block => 
                block.miner.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        this.displayBlocks();
    }

    updateStats() {
        this.elements.totalBlocks.textContent = this.allBlocks.length;
        
        const uniqueMiners = new Set(this.allBlocks.map(b => b.miner));
        this.elements.totalMiners.textContent = uniqueMiners.size;
        
        const isValid = this.blockchain.isChainValid();
        this.elements.chainValid.textContent = isValid ? '✓' : '✗';
        this.elements.chainValid.style.color = isValid ? 'var(--success)' : 'var(--error)';
    }

    displayBlocks() {
        if (this.filteredBlocks.length === 0) {
            this.elements.blocksContainer.innerHTML = '<div class="loading">No blocks found</div>';
            return;
        }

        this.elements.blocksContainer.innerHTML = '';
        
        // Show blocks in reverse order (newest first)
        const reversedBlocks = [...this.filteredBlocks].reverse();
        
        reversedBlocks.forEach((block) => {
            const blockCard = document.createElement('div');
            blockCard.className = `block-card ${block.index === 0 ? 'genesis' : ''}`;
            
            const timeStr = new Date(block.timestamp).toLocaleString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            blockCard.innerHTML = `
                <div class="block-header-row">
                    <div class="block-number">Block #${block.index}</div>
                    <div class="block-time">${timeStr}</div>
                </div>
                
                <div class="block-details">
                    <div class="block-detail-item">
                        <span class="detail-label">Hash</span>
                        <span class="detail-value hash-value">${block.hash}</span>
                    </div>
                    <div class="block-detail-item">
                        <span class="detail-label">Previous Hash</span>
                        <span class="detail-value hash-value">${block.previousHash}</span>
                    </div>
                    ${block.problem ? `
                        <div class="block-detail-item">
                            <span class="detail-label">Problem</span>
                            <span class="detail-value">${block.problem}</span>
                        </div>
                        <div class="block-detail-item">
                            <span class="detail-label">Answer</span>
                            <span class="detail-value answer-value">${block.answer}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="block-miner-info">
                    <div class="miner-avatar-small">${block.miner.charAt(0).toUpperCase()}</div>
                    <span>Mined by <strong>${block.miner}</strong></span>
                </div>
            `;

            this.elements.blocksContainer.appendChild(blockCard);
        });
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BlocksPage();
    });
} else {
    new BlocksPage();
}
