// Blockchain Core Logic

class Block {
    constructor(index, timestamp, data, previousHash = '', miner = 'Genesis', problem = null, answer = null) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.miner = miner;
        this.problem = problem;
        this.answer = answer;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        // Simple hash simulation using string concatenation and basic encoding
        const blockString = this.index + this.previousHash + this.timestamp + 
                          JSON.stringify(this.data) + this.miner;
        return this.simpleHash(blockString);
    }

    simpleHash(str) {
        // Simple hash function for educational purposes
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16).padStart(12, '0').substring(0, 12);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 'medium';
    }

    createGenesisBlock() {
        return new Block(0, new Date().toISOString(), 'Genesis Block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        // Verify blockchain integrity
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Check if current block's hash is valid
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // Check if previous hash matches
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    getChainData() {
        return this.chain;
    }

    getBlockByIndex(index) {
        return this.chain[index];
    }

    getMinerStats() {
        const stats = {};
        this.chain.forEach(block => {
            if (block.index > 0) { // Skip genesis block
                if (!stats[block.miner]) {
                    stats[block.miner] = 0;
                }
                stats[block.miner]++;
            }
        });
        return stats;
    }
}

// Export for use in other modules
export { Block, Blockchain };
