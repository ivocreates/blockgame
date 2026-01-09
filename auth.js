// Simple Authentication Module (No Firebase Auth)
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUpRsuU3VOZZ73bzPzB0R_MxnXPE7X8J0",
    authDomain: "blkchngaw3.firebaseapp.com",
    databaseURL: "https://blkchngaw3-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "blkchngaw3",
    storageBucket: "blkchngaw3.firebasestorage.app",
    messagingSenderId: "221546853692",
    appId: "1:221546853692:web:4754a6bec2bdd116689a39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Simple Auth Manager Class
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.loadUserFromStorage();
    }

    loadUserFromStorage() {
        const userProfile = localStorage.getItem('userProfile');
        if (userProfile) {
            this.currentUser = JSON.parse(userProfile);
        }
    }

    sanitizeUserId(name) {
        // Create a simple ID from name + timestamp
        const timestamp = Date.now();
        return `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${timestamp}`;
    }

    // Simple registration - just name, grade, and optional email
    async registerUser(name, grade, email = '') {
        try {
            if (!name || !grade) {
                return { success: false, error: 'Name and grade are required' };
            }

            const userId = this.sanitizeUserId(name);
            const userRef = ref(database, `users/${userId}`);

            const userProfile = {
                userId: userId,
                name: name.trim(),
                email: email.trim(),
                grade: parseInt(grade),
                blocksMined: 0,
                createdAt: new Date().toISOString(),
                lastActive: new Date().toISOString()
            };

            await set(userRef, userProfile);
            
            // Store in localStorage
            localStorage.setItem('userId', userId);
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
            this.currentUser = userProfile;

            return { success: true, user: userProfile };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message || 'Failed to register' };
        }
    }

    isAuthenticated() {
        return !!this.currentUser || !!localStorage.getItem('userId');
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const userProfile = localStorage.getItem('userProfile');
            if (userProfile) {
                this.currentUser = JSON.parse(userProfile);
            }
        }
        return this.currentUser;
    }

    getUserProfile() {
        const profile = localStorage.getItem('userProfile');
        return profile ? JSON.parse(profile) : null;
    }

    async updateUserProfile(userId, updates) {
        try {
            const userRef = ref(database, `users/${userId}`);
            const snapshot = await get(userRef);
            
            if (snapshot.exists()) {
                const currentData = snapshot.val();
                await set(userRef, { ...currentData, ...updates });
                localStorage.setItem('userProfile', JSON.stringify({ ...currentData, ...updates }));
                return { success: true };
            }
            return { success: false, error: 'User not found' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    signOutUser() {
        this.currentUser = null;
        localStorage.removeItem('userId');
        localStorage.removeItem('userProfile');
        return { success: true };
    }
}

const authManager = new AuthManager();
export { authManager };
