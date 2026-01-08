// Landing Page Logic
import { authManager } from './auth.js';

class LandingPage {
    constructor() {
        this.init();
    }

    init() {
        // Check if user is already authenticated
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
            signInForm: document.getElementById('signInForm'),
            signUpForm: document.getElementById('signUpForm'),
            resetPasswordForm: document.getElementById('resetPasswordForm'),
            authFeedback: document.getElementById('authFeedback'),
            forgotPasswordLink: document.getElementById('forgotPasswordLink'),
            backToSignIn: document.getElementById('backToSignIn'),
            authTabs: document.querySelectorAll('.auth-tab'),
            googleSignInBtn: document.getElementById('googleSignInBtn'),
            googleSignUpBtn: document.getElementById('googleSignUpBtn')
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

        // Tab switching
        this.elements.authTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Form submissions
        this.elements.signInForm.addEventListener('submit', (e) => this.handleSignIn(e));
        this.elements.signUpForm.addEventListener('submit', (e) => this.handleSignUp(e));
        this.elements.resetPasswordForm.addEventListener('submit', (e) => this.handlePasswordReset(e));

        // Forgot password
        this.elements.forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showResetPasswordForm();
        });

        // Back to sign in
        this.elements.backToSignIn.addEventListener('click', () => this.showSignInForm());

        // Google sign in/up
        this.elements.googleSignInBtn.addEventListener('click', () => this.handleGoogleAuth());
        this.elements.googleSignUpBtn.addEventListener('click', () => this.handleGoogleAuth());
    }

    showAuthModal() {
        this.elements.authModal.style.display = 'flex';
    }

    hideAuthModal() {
        this.elements.authModal.style.display = 'none';
        this.clearFeedback();
    }

    switchTab(tab) {
        this.elements.authTabs.forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');

        if (tab === 'signin') {
            this.showSignInForm();
        } else {
            this.showSignUpForm();
        }
    }

    showSignInForm() {
        this.elements.signInForm.style.display = 'block';
        this.elements.signUpForm.style.display = 'none';
        this.elements.resetPasswordForm.style.display = 'none';
        this.elements.authTabs[0].classList.add('active');
        this.elements.authTabs[1].classList.remove('active');
        this.clearFeedback();
    }

    showSignUpForm() {
        this.elements.signInForm.style.display = 'none';
        this.elements.signUpForm.style.display = 'block';
        this.elements.resetPasswordForm.style.display = 'none';
        this.clearFeedback();
    }

    showResetPasswordForm() {
        this.elements.signInForm.style.display = 'none';
        this.elements.signUpForm.style.display = 'none';
        this.elements.resetPasswordForm.style.display = 'block';
        this.clearFeedback();
    }

    async handleSignIn(e) {
        e.preventDefault();
        const email = document.getElementById('signInEmail').value.trim();
        const password = document.getElementById('signInPassword').value;

        this.showLoading('Signing in...');

        const result = await authManager.signInWithEmail(email, password);
        
        if (result.success) {
            this.showFeedback('Success! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 1000);
        } else {
            this.showFeedback(result.error, 'error');
        }
    }

    async handleSignUp(e) {
        e.preventDefault();
        const name = document.getElementById('signUpName').value.trim();
        const email = document.getElementById('signUpEmail').value.trim();
        const password = document.getElementById('signUpPassword').value;
        const grade = document.getElementById('signUpGrade').value;

        // Validation
        if (!this.validateSignUp(name, email, password, grade)) {
            return;
        }

        this.showLoading('Creating account...');

        const result = await authManager.signUpWithEmail(email, password, name, grade);
        
        if (result.success) {
            this.showFeedback('Account created! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 1000);
        } else {
            this.showFeedback(result.error, 'error');
        }
    }

    async handlePasswordReset(e) {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value.trim();

        if (!email) {
            this.showFeedback('Please enter your email address', 'error');
            return;
        }

        this.showLoading('Sending reset link...');

        const result = await authManager.resetPassword(email);
        
        if (result.success) {
            this.showFeedback('Password reset link sent! Check your email.', 'success');
            setTimeout(() => {
                this.showSignInForm();
            }, 3000);
        } else {
            this.showFeedback(result.error, 'error');
        }
    }

    async handleGoogleAuth() {
        this.showLoading('Signing in with Google...');

        const result = await authManager.signInWithGoogle();
        
        if (result.success) {
            // Check if user has grade set, if not prompt for it
            const profile = authManager.getUserProfile();
            if (!profile || !profile.grade) {
                const grade = prompt('Please enter your grade (8-12):');
                if (grade && grade >= 8 && grade <= 12) {
                    await authManager.updateUserProfile(
                        authManager.sanitizeUserId(result.user.email),
                        { grade: parseInt(grade) }
                    );
                }
            }
            
            this.showFeedback('Success! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 1000);
        } else {
            if (!result.error.includes('popup was closed')) {
                this.showFeedback(result.error, 'error');
            }
        }
    }

    validateSignUp(name, email, password, grade) {
        if (name.length < 2 || name.length > 50) {
            this.showFeedback('Name must be between 2 and 50 characters', 'error');
            return false;
        }

        if (!/^[a-zA-Z\s]+$/.test(name)) {
            this.showFeedback('Name should only contain letters and spaces', 'error');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showFeedback('Please enter a valid email address', 'error');
            return false;
        }

        if (password.length < 6) {
            this.showFeedback('Password must be at least 6 characters', 'error');
            return false;
        }

        const gradeNum = parseInt(grade);
        if (isNaN(gradeNum) || gradeNum < 8 || gradeNum > 12) {
            this.showFeedback('Grade must be between 8 and 12', 'error');
            return false;
        }

        return true;
    }

    showFeedback(message, type) {
        this.elements.authFeedback.textContent = message;
        this.elements.authFeedback.className = `auth-feedback ${type}`;
        this.elements.authFeedback.style.display = 'block';
    }

    showLoading(message) {
        this.showFeedback(message, 'info');
    }

    clearFeedback() {
        this.elements.authFeedback.style.display = 'none';
        this.elements.authFeedback.textContent = '';
    }
}

// Initialize landing page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LandingPage();
    });
} else {
    new LandingPage();
}
