// src/services/db.js

class QuizDatabase {
    constructor() {
      this.dbName = 'QuizPlatformDB';
      this.version = 1;
      this.db = null;
    }
  
    async init() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);
  
        request.onerror = () => {
          reject(new Error('Failed to open database'));
        };
  
        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve();
        };
  
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          
          // Create attempts store if it doesn't exist
          if (!db.objectStoreNames.contains('attempts')) {
            const store = db.createObjectStore('attempts', {
              keyPath: 'id',
              autoIncrement: true,
            });
            
            // Create indexes for querying
            store.createIndex('date', 'date', { unique: false });
            store.createIndex('score', 'score', { unique: false });
            store.createIndex('userId', 'userId', { unique: false });
          }
        };
      });
    }
  
    async saveAttempt(attempt) {
      if (!this.db) {
        await this.init();
      }
  
      return new Promise((resolve, reject) => {
        try {
          const transaction = this.db.transaction('attempts', 'readwrite');
          const store = transaction.objectStore('attempts');
          
          const request = store.add({
            ...attempt,
            date: new Date().toISOString(),
            questions: attempt.questions || [],
            answers: attempt.answers || [],
            score: attempt.score || 0,
            timeSpent: attempt.timeSpent || 0,
            completed: true
          });
          
          request.onsuccess = () => {
            resolve(request.result);
          };
          
          request.onerror = () => {
            reject(new Error('Failed to save attempt'));
          };
        } catch (error) {
          reject(new Error('Transaction failed'));
        }
      });
    }
  
    async getAttempts() {
      if (!this.db) {
        await this.init();
      }
  
      return new Promise((resolve, reject) => {
        try {
          const transaction = this.db.transaction('attempts', 'readonly');
          const store = transaction.objectStore('attempts');
          const request = store.getAll();
  
          request.onsuccess = () => {
            resolve(request.result);
          };
  
          request.onerror = () => {
            reject(new Error('Failed to retrieve attempts'));
          };
        } catch (error) {
          reject(new Error('Transaction failed'));
        }
      });
    }
  
    async getAttemptById(id) {
      if (!this.db) {
        await this.init();
      }
  
      return new Promise((resolve, reject) => {
        try {
          const transaction = this.db.transaction('attempts', 'readonly');
          const store = transaction.objectStore('attempts');
          const request = store.get(id);
  
          request.onsuccess = () => {
            resolve(request.result || null);
          };
  
          request.onerror = () => {
            reject(new Error('Failed to retrieve attempt'));
          };
        } catch (error) {
          reject(new Error('Transaction failed'));
        }
      });
    }
  
    async getStats() {
      try {
        const attempts = await this.getAttempts();
        
        if (attempts.length === 0) {
          return {
            totalAttempts: 0,
            averageScore: 0,
            bestScore: 0,
            averageTimePerQuestion: 0,
            completionRate: 0
          };
        }
  
        const completedAttempts = attempts.filter(a => a.completed);
        const totalAttempts = attempts.length;
        const averageScore = attempts.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts;
        const bestScore = Math.max(...attempts.map(a => a.score));
        const averageTimePerQuestion = attempts.reduce((acc, curr) => 
          acc + (curr.timeSpent / curr.questions.length), 0) / totalAttempts;
        const completionRate = (completedAttempts.length / totalAttempts) * 100;
  
        return {
          totalAttempts,
          averageScore: Math.round(averageScore * 10) / 10,
          bestScore,
          averageTimePerQuestion: Math.round(averageTimePerQuestion),
          completionRate: Math.round(completionRate)
        };
      } catch (error) {
        console.error('Failed to get stats:', error);
        throw error;
      }
    }
  
    async clearAttempts() {
      if (!this.db) {
        await this.init();
      }
  
      return new Promise((resolve, reject) => {
        try {
          const transaction = this.db.transaction('attempts', 'readwrite');
          const store = transaction.objectStore('attempts');
          const request = store.clear();
  
          request.onsuccess = () => {
            resolve();
          };
  
          request.onerror = () => {
            reject(new Error('Failed to clear attempts'));
          };
        } catch (error) {
          reject(new Error('Transaction failed'));
        }
      });
    }
  
    async deleteAttempt(id) {
      if (!this.db) {
        await this.init();
      }
  
      return new Promise((resolve, reject) => {
        try {
          const transaction = this.db.transaction('attempts', 'readwrite');
          const store = transaction.objectStore('attempts');
          const request = store.delete(id);
  
          request.onsuccess = () => {
            resolve();
          };
  
          request.onerror = () => {
            reject(new Error('Failed to delete attempt'));
          };
        } catch (error) {
          reject(new Error('Transaction failed'));
        }
      });
    }
  }
  
  // Create and export a single instance
  export const quizDB = new QuizDatabase();