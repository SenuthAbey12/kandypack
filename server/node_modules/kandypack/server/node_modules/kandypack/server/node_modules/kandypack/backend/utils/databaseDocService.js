/**
 * Database documentation update service
 * Automatically updates documentation when database changes occur
 */
class DatabaseDocService {
  constructor() {
    this.generator = null; // Will be created when needed
    this.lastUpdateTime = null;
    this.updateQueue = [];
    this.isUpdating = false;
    
    // Debounce time (milliseconds) to prevent too frequent updates
    this.debounceTime = 5000; // 5 seconds
  }

  // Lazy initialization of generator
  getGenerator() {
    if (!this.generator) {
      const DatabaseDocumentationGenerator = require('./databaseDocumentationGenerator');
      this.generator = new DatabaseDocumentationGenerator();
    }
    return this.generator;
  }

  /**
   * Schedules a documentation update
   */
  scheduleUpdate(operation = 'general', tableName = 'unknown') {
    const updateInfo = {
      operation,
      tableName,
      timestamp: new Date()
    };
    
    this.updateQueue.push(updateInfo);
    console.log(`📄 Scheduled database documentation update: ${operation} on ${tableName}`);
    
    // Debounce updates to prevent excessive file writes
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    
    this.updateTimeout = setTimeout(() => {
      this.executeUpdate();
    }, this.debounceTime);
  }

  /**
   * Executes the documentation update
   */
  async executeUpdate() {
    if (this.isUpdating) {
      console.log('📄 Documentation update already in progress, skipping...');
      return;
    }

    this.isUpdating = true;
    
    try {
      const operations = this.updateQueue.splice(0); // Clear queue
      console.log(`📄 Updating database documentation (${operations.length} operations queued)...`);
      
      const success = await this.getGenerator().saveDocumentation();
      
      if (success) {
        this.lastUpdateTime = new Date();
        console.log('✅ Database documentation updated successfully');
        
        // Log what triggered the update
        const uniqueOperations = [...new Set(operations.map(op => `${op.operation}(${op.tableName})`))];
        console.log(`📋 Update triggered by: ${uniqueOperations.join(', ')}`);
      } else {
        console.error('❌ Failed to update database documentation');
      }
      
    } catch (error) {
      console.error('❌ Error updating database documentation:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Forces an immediate documentation update
   */
  async forceUpdate(reason = 'manual') {
    console.log(`📄 Force updating database documentation: ${reason}`);
    
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    
    await this.executeUpdate();
  }

  /**
   * Checks if documentation needs updating based on time
   */
  needsPeriodicUpdate() {
    if (!this.lastUpdateTime) return true;
    
    const hoursSinceUpdate = (Date.now() - this.lastUpdateTime.getTime()) / (1000 * 60 * 60);
    return hoursSinceUpdate >= 24; // Update at least once a day
  }

  /**
   * Performs periodic update check
   */
  async periodicUpdateCheck() {
    if (this.needsPeriodicUpdate()) {
      console.log('📄 Performing periodic database documentation update...');
      await this.forceUpdate('periodic');
    }
  }

  /**
   * Gets current documentation status
   */
  getStatus() {
    return {
      lastUpdate: this.lastUpdateTime,
      isUpdating: this.isUpdating,
      queueLength: this.updateQueue.length,
      needsUpdate: this.needsPeriodicUpdate()
    };
  }
}

// Create singleton instance
const docService = new DatabaseDocService();

// Set up periodic update check (every hour)
setInterval(() => {
  docService.periodicUpdateCheck();
}, 60 * 60 * 1000); // 1 hour

module.exports = docService;