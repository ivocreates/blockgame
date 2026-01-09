// Landing Page Logic
import { authManager } from './auth.js';

class LandingPage {
    constructor() {
        this.init();
    }

    init() {
        // Check if user is already registered
        const userId = localStorage.getItem('userId');
        if (userId && authManager.isAuthenticated()) {
            // User is logged in, redirect to game
            window.location.href = 'game.html';
            return;
        }

        this.elements = {
            authModal: document.getElementById('authModal'),
            closeAuthModal: document.getElementById('closeAuthModal'),
            getStartedBtn: document.getElementById('getStartedBtn'),
            ctaStartBtn: document.getElementById('ctaStartBtn'),
            entryForm: document.getElementById('entryForm'),
            authFeedback: document.getElementById('authFeedback')
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Open auth modal
        this.elements.getStartedBtn.addEventListener('click', () => this.showAuthModal());
        this.elements.ctaStartBtn.addEventListener('click', () => this.showAuthModal());

        // Close auth modal
        this.elements.closeAuthModal.addEventListener('click', () => this.hideAuthModal());
        this.elements.authModal.addEventListener('click', (e) => {
            if (e.target === this.elements.authModal) {
                this.hideAuthModal();
            }
        });

        // Form submission
        this.elements.entryForm.addEventListener('submit', (e) => this.handleEntry(e));
    }

    showAuthModal() {
        this.elements.authModal.style.display = 'flex';
    }

    hideAuthModal() {
        this.elements.authModal.style.display = 'none';
        this.clearFeedback();
    }

    async handleEntry(e) {
        e.preventDefault();
        const name = document.getElementById('userName').value.trim();
        const grade = document.getElementById('userGrade').value;
        const email = document.getElementById('userEmail').value.trim();

        // Validation
        if (!name) {
            this.showFeedback('Please enter your name', 'error');
            return;
        }

        if (!grade || grade < 5 || grade > 15) {
            this.showFeedback('Please select a valid grade (5-15)', 'error');
            return;
        }

        this.showLoading('Creating your profile...');

        const result = await authManager.registerUser(name, grade, email);
        
        if (result.success) {
            this.showFeedback('Success! Starting your mining journey...', 'success');
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 1000);
        } else {
            this.showFeedback(result.error, 'error');
        }
    }

    showLoading(message) {
        this.elements.authFeedback.textContent = message;
        this.elements.authFeedback.className = 'auth-feedback loading';
        this.elements.authFeedback.style.display = 'block';
    }

    showFeedback(message, type) {
        this.elements.authFeedback.textContent = message;
        this.elements.authFeedback.className = `auth-feedback ${type}`;
        this.elements.authFeedback.style.display = 'block';
    }

    clearFeedback() {
        this.elements.authFeedback.textContent = '';
        this.elements.authFeedback.style.display = 'none';
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LandingPage();
    });
} else {
    new LandingPage();
}
