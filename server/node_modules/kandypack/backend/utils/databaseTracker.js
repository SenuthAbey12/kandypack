const docService = require('./databaseDocService');

/**
 * Database operation tracking middleware
 * Automatically triggers documentation updates when database changes occur
 */
class DatabaseTracker {
  
  /**
   * Wraps database query function to track operations
   */
  static wrapDatabaseQuery(originalQuery) {
    return async function trackedQuery(sql, params = []) {
      const result = await originalQuery.call(this, sql, params);
      
      // Analyze the SQL to determine if it modifies data
      const sqlUpper = sql.trim().toUpperCase();
      const isModifyingOperation = 
        sqlUpper.startsWith('INSERT') ||
        sqlUpper.startsWith('UPDATE') ||
        sqlUpper.startsWith('DELETE') ||
        sqlUpper.startsWith('ALTER') ||
        sqlUpper.startsWith('CREATE') ||
        sqlUpper.startsWith('DROP');
      
      if (isModifyingOperation) {
        const operation = sqlUpper.split(' ')[0].toLowerCase();
        const tableName = DatabaseTracker.extractTableName(sql);
        
        // Schedule documentation update
        docService.scheduleUpdate(operation, tableName);
      }
      
      return result;
    };
  }

  /**
   * Extracts table name from SQL query
   */
  static extractTableName(sql) {
    const sqlUpper = sql.trim().toUpperCase();
    
    // Handle different SQL operations
    if (sqlUpper.startsWith('INSERT INTO')) {
      const match = sql.match(/INSERT\s+INTO\s+`?(\w+)`?/i);
      return match ? match[1] : 'unknown';
    }
    
    if (sqlUpper.startsWith('UPDATE')) {
      const match = sql.match(/UPDATE\s+`?(\w+)`?/i);
      return match ? match[1] : 'unknown';
    }
    
    if (sqlUpper.startsWith('DELETE FROM')) {
      const match = sql.match(/DELETE\s+FROM\s+`?(\w+)`?/i);
      return match ? match[1] : 'unknown';
    }
    
    if (sqlUpper.startsWith('ALTER TABLE')) {
      const match = sql.match(/ALTER\s+TABLE\s+`?(\w+)`?/i);
      return match ? match[1] : 'unknown';
    }
    
    if (sqlUpper.startsWith('CREATE TABLE')) {
      const match = sql.match(/CREATE\s+TABLE\s+`?(\w+)`?/i);
      return match ? match[1] : 'unknown';
    }
    
    if (sqlUpper.startsWith('DROP TABLE')) {
      const match = sql.match(/DROP\s+TABLE\s+`?(\w+)`?/i);
      return match ? match[1] : 'unknown';
    }
    
    return 'unknown';
  }

  /**
   * Creates tracking functions for specific operations
   */
  static createOperationTracker(operation, tableName) {
    return () => {
      docService.scheduleUpdate(operation, tableName);
    };
  }

  /**
   * Manual trigger for documentation update
   */
  static triggerUpdate(operation, tableName, reason = 'manual') {
    console.log(`📄 Manual documentation update trigger: ${operation} on ${tableName} (${reason})`);
    docService.scheduleUpdate(operation, tableName);
  }

  /**
   * Gets documentation service status
   */
  static getDocumentationStatus() {
    return docService.getStatus();
  }

  /**
   * Forces immediate documentation update
   */
  static async forceDocumentationUpdate(reason = 'forced') {
    return await docService.forceUpdate(reason);
  }
}

module.exports = DatabaseTracker;