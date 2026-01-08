// Firebase Authentication Module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

// Auth Manager Class
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.setupAuthListener();
    }

    setupAuthListener() {
        onAuthStateChanged(auth, async (user) => {
            this.currentUser = user;
            if (user) {
                // User is signed in
                await this.loadOrCreateUserProfile(user);
            } else {
                // User is signed out
                localStorage.removeItem('userId');
                localStorage.removeItem('userProfile');
            }
        });
    }

    async loadOrCreateUserProfile(user) {
        const userId = this.sanitizeUserId(user.email || user.uid);
        const userRef = ref(database, `users/${userId}`);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
            // Create new user profile
            const defaultProfile = {
                userId: userId,
                name: user.displayName || 'New Miner',
                email: user.email,
                grade: 10,
                blocksMined: 0,
                createdAt: new Date().toISOString()
            };
            await set(userRef, defaultProfile);
            localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
        } else {
            localStorage.setItem('userProfile', JSON.stringify(snapshot.val()));
        }
        
        localStorage.setItem('userId', userId);
    }

    sanitizeUserId(email) {
        return email.toLowerCase().replace(/[^a-z0-9]/g, '_');
    }

    // Sign up with email/password
    async signUpWithEmail(email, password, name, grade) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Create user profile
            const userId = this.sanitizeUserId(email);
            const userRef = ref(database, `users/${userId}`);
            await set(userRef, {
                userId: userId,
                name: name,
                email: email,
                grade: parseInt(grade),
                blocksMined: 0,
                createdAt: new Date().toISOString()
            });

            return { success: true, user: user };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Sign in with email/password
    async signInWithEmail(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Sign in with Google
    async signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Reset password
    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Sign out
    async signOutUser() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get user profile from localStorage
    getUserProfile() {
        const profile = localStorage.getItem('userProfile');
        return profile ? JSON.parse(profile) : null;
    }

    // Update user profile
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

    // Get friendly error messages
    getErrorMessage(error) {
        const errorMessages = {
            'auth/email-already-in-use': 'Email is already registered. Please sign in.',
            'auth/invalid-email': 'Invalid email address.',
            'auth/operation-not-allowed': 'Operation not allowed. Please contact support.',
            'auth/weak-password': 'Password should be at least 6 characters.',
            'auth/user-disabled': 'This account has been disabled.',
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password.',
            'auth/invalid-credential': 'Invalid email or password.',
            'auth/too-many-requests': 'Too many attempts. Please try again later.',
            'auth/network-request-failed': 'Network error. Please check your connection.',
            'auth/popup-closed-by-user': 'Sign-in popup was closed.'
        };

        return errorMessages[error.code] || error.message;
    }
}

// Create singleton instance
const authManager = new AuthManager();

export { authManager, auth };
