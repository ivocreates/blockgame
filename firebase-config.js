// Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, push, query, orderByChild, limitToLast, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
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

// Database helper functions
class FirebaseHelper {
    constructor() {
        this.db = database;
    }

    // Save/Update user profile
    async saveUserProfile(userId, profileData) {
        try {
            const userRef = ref(this.db, `users/${userId}`);
            await set(userRef, {
                ...profileData,
                createdAt: profileData.createdAt || new Date().toISOString(),
                lastActive: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error("Error saving user profile:", error);
            return false;
        }
    }

    // Get user profile
    async getUserProfile(userId) {
        try {
            const userRef = ref(this.db, `users/${userId}`);
            const snapshot = await get(userRef);
            
            if (snapshot.exists()) {
                return snapshot.val();
            }
            return null;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }
    }

    // Save miner score
    async saveMinerScore(userId, minerName, grade, blocksMined) {
        try {
            const minerRef = ref(this.db, `miners/${userId}`);
            const snapshot = await get(minerRef);
            
            let currentBlocks = 0;
            if (snapshot.exists()) {
                currentBlocks = snapshot.val().blocksMined || 0;
            }

            await set(minerRef, {
                userId: userId,
                name: minerName,
                grade: grade,
                blocksMined: currentBlocks + blocksMined,
                lastMined: new Date().toISOString()
            });

            return true;
        } catch (error) {
            console.error("Error saving miner score:", error);
            return false;
        }
    }

    // Get leaderboard
    async getLeaderboard(limit = 10) {
        try {
            const minersRef = ref(this.db, 'miners');
            const leaderboardQuery = query(minersRef, orderByChild('blocksMined'), limitToLast(limit));
            
            const snapshot = await get(leaderboardQuery);
            const leaderboard = [];

            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    leaderboard.push(childSnapshot.val());
                });
            }

            // Sort in descending order
            return leaderboard.reverse();
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            return [];
        }
    }

    // Get all miners (for pagination)
    async getAllMiners() {
        try {
            const minersRef = ref(this.db, 'miners');
            const snapshot = await get(minersRef);
            const miners = [];

            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    miners.push(childSnapshot.val());
                });
            }

            // Sort by blocksMined in descending order
            return miners.sort((a, b) => b.blocksMined - a.blocksMined);
        } catch (error) {
            console.error("Error fetching all miners:", error);
            return [];
        }
    }

    // Listen to leaderboard updates in real-time
    onLeaderboardUpdate(callback, limit = 10) {
        const minersRef = ref(this.db, 'miners');
        const leaderboardQuery = query(minersRef, orderByChild('blocksMined'), limitToLast(limit));

        return onValue(leaderboardQuery, (snapshot) => {
            const leaderboard = [];
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    leaderboard.push(childSnapshot.val());
                });
            }
            callback(leaderboard.reverse());
        });
    }

    // Save blockchain state (optional - for persistence)
    async saveBlockchainState(chainData) {
        try {
            const blockchainRef = ref(this.db, 'blockchain');
            await set(blockchainRef, {
                chain: chainData,
                lastUpdated: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error("Error saving blockchain state:", error);
            return false;
        }
    }

    // Get blockchain state
    async getBlockchainState() {
        try {
            const blockchainRef = ref(this.db, 'blockchain');
            const snapshot = await get(blockchainRef);
            
            if (snapshot.exists()) {
                return snapshot.val().chain;
            }
            return null;
        } catch (error) {
            console.error("Error fetching blockchain state:", error);
            return null;
        }
    }
}

export { FirebaseHelper };
