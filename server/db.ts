// Database configuration - uses SQLite for local development
import { initializeDatabase, sqliteDB } from './db-sqlite';

// Initialize SQLite database on startup
initializeDatabase();

// Export database helper functions
export const db = sqliteDB;

// For backward compatibility with existing code
export default {
  query: async (sql: string, params?: any[]) => {
    // This is a compatibility layer - in real implementation, 
    // routes should use sqliteDB directly
    console.log('Legacy query called:', sql);
    return [];
  },
  
  // Export SQLite DB functions
  ...sqliteDB
};

console.log('✅ Database module loaded (SQLite mode)');
