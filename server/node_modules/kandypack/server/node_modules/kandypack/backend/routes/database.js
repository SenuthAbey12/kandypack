const express = require('express');
const DatabaseDocumentationGenerator = require('../utils/databaseDocumentationGenerator');
const DatabaseTracker = require('../utils/databaseTracker');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// GET /api/database/documentation - Returns the current database documentation
router.get('/documentation', async (req, res) => {
  try {
    const docPath = path.join(__dirname, '../../DATABASE_STRUCTURE.md');
    
    try {
      const documentation = await fs.readFile(docPath, 'utf8');
      res.json({
        success: true,
        documentation,
        lastModified: (await fs.stat(docPath)).mtime
      });
    } catch (fileError) {
      // If file doesn't exist, generate it
      const generator = new DatabaseDocumentationGenerator();
      const documentation = await generator.generateDocumentation();
      await generator.saveDocumentation();
      
      res.json({
        success: true,
        documentation,
        message: 'Documentation generated for the first time',
        lastModified: new Date()
      });
    }
  } catch (error) {
    console.error('Error fetching database documentation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch database documentation'
    });
  }
});

// POST /api/database/generate-docs - Manually trigger documentation generation
router.post('/generate-docs', async (req, res) => {
  try {
    const { reason = 'manual' } = req.body;
    
    console.log(`📄 Manual database documentation generation requested: ${reason}`);
    
    const generator = new DatabaseDocumentationGenerator();
    const success = await generator.saveDocumentation();
    
    if (success) {
      res.json({
        success: true,
        message: 'Database documentation generated successfully',
        timestamp: new Date(),
        reason
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to generate database documentation'
      });
    }
  } catch (error) {
    console.error('Error generating database documentation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate database documentation'
    });
  }
});

// GET /api/database/status - Returns documentation service status
router.get('/status', async (req, res) => {
  try {
    const status = DatabaseTracker.getDocumentationStatus();
    const generator = new DatabaseDocumentationGenerator();
    const dbStats = await generator.getDatabaseStats();
    
    res.json({
      success: true,
      status: {
        ...status,
        databaseStats: dbStats,
        serverTime: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting documentation status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get documentation status'
    });
  }
});

// POST /api/database/force-update - Force immediate documentation update
router.post('/force-update', async (req, res) => {
  try {
    const { reason = 'manual-force' } = req.body;
    
    console.log(`📄 Force documentation update requested: ${reason}`);
    
    await DatabaseTracker.forceDocumentationUpdate(reason);
    
    res.json({
      success: true,
      message: 'Database documentation force updated successfully',
      timestamp: new Date(),
      reason
    });
  } catch (error) {
    console.error('Error forcing documentation update:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to force documentation update'
    });
  }
});

// GET /api/database/stats - Get current database statistics
router.get('/stats', async (req, res) => {
  try {
    const generator = new DatabaseDocumentationGenerator();
    const stats = await generator.getDatabaseStats();
    const tables = await generator.getTables();
    
    res.json({
      success: true,
      stats: {
        totalTables: tables.length,
        tableList: tables,
        recordCounts: stats,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Error getting database stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get database statistics'
    });
  }
});

module.exports = router;