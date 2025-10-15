const fs = require('fs').promises;
const path = require('path');
const database = require('../config/database');

class DatabaseDocumentationGenerator {
  constructor() {
    this.docPath = path.join(__dirname, '../../DATABASE_STRUCTURE.md');
  }

  async getTables() {
    try {
      const tables = await database.query("SHOW TABLES");
      return tables.map(table => Object.values(table)[0]);
    } catch (error) {
      console.error('Error fetching tables:', error);
      return [];
    }
  }

  async getTableStructure(tableName) {
    try {
      const structure = await database.query(`DESCRIBE ${tableName}`);
      return structure;
    } catch (error) {
      console.error(`Error fetching structure for ${tableName}:`, error);
      return [];
    }
  }

  async getTableRowCount(tableName) {
    try {
      const result = await database.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      return result[0].count;
    } catch (error) {
      console.error(`Error getting row count for ${tableName}:`, error);
      return 0;
    }
  }

  async getSampleData(tableName) {
    try {
      const data = await database.query(`SELECT * FROM ${tableName} LIMIT 3`);
      return data;
    } catch (error) {
      console.error(`Error getting sample data for ${tableName}:`, error);
      return [];
    }
  }

  formatTableStructure(structure) {
    let markdown = '| Column | Type | Null | Key | Default | Extra |\n';
    markdown += '|--------|------|------|-----|---------|-------|\n';
    
    structure.forEach(col => {
      markdown += `| ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default || 'NULL'} | ${col.Extra} |\n`;
    });
    
    return markdown;
  }

  formatSampleData(data) {
    if (data.length === 0) return '*No data available*\n';
    
    const columns = Object.keys(data[0]);
    let markdown = '| ' + columns.join(' | ') + ' |\n';
    markdown += '|' + columns.map(() => '---').join('|') + '|\n';
    
    data.forEach(row => {
      const values = columns.map(col => {
        let value = row[col];
        if (value === null) return 'NULL';
        if (typeof value === 'string' && value.length > 30) {
          return value.substring(0, 27) + '...';
        }
        return value;
      });
      markdown += '| ' + values.join(' | ') + ' |\n';
    });
    
    return markdown;
  }

  async generateDocumentation() {
    try {
      const tables = await this.getTables();
      const timestamp = new Date().toLocaleString();
      
      let documentation = `# 📊 KandyPack Database Documentation

*Last Updated: ${timestamp}*

## 🗄️ Database Overview

**Database Name:** kandypack  
**Total Tables:** ${tables.length}  
**Database Engine:** MySQL  

## 📋 Table Summary

`;

      // Add table summary
      for (const tableName of tables) {
        const rowCount = await this.getTableRowCount(tableName);
        documentation += `- **${tableName}**: ${rowCount} records\n`;
      }

      documentation += '\n## 📊 Detailed Table Information\n\n';

      // Add detailed information for each table
      for (const tableName of tables) {
        console.log(`📖 Documenting table: ${tableName}`);
        
        const structure = await this.getTableStructure(tableName);
        const rowCount = await this.getTableRowCount(tableName);
        const sampleData = await this.getSampleData(tableName);

        documentation += `### 🏷️ ${tableName}\n\n`;
        documentation += `**Records:** ${rowCount}\n\n`;

        // Table structure
        documentation += '#### 📐 Table Structure\n\n';
        documentation += this.formatTableStructure(structure);
        documentation += '\n';

        // Sample data
        documentation += '#### 📄 Sample Data\n\n';
        documentation += this.formatSampleData(sampleData);
        documentation += '\n';

        documentation += '---\n\n';
      }

      documentation += this.generateUsageNotes();

      return documentation;

    } catch (error) {
      console.error('Error generating database documentation:', error);
      throw error;
    }
  }

  generateUsageNotes() {
    return `## 📝 Usage Notes

### 🔐 Authentication Tables
- **admin**: Stores administrator accounts with hashed passwords
- **customer**: Stores customer accounts with profile information

### 🛍️ Product Management
- **product**: Catalog of available products with pricing and inventory

### 📦 Order System
- **orders**: Main order records with customer and delivery information
- **order_item**: Individual items within each order

### 🔧 Data Integrity
- Foreign key constraints ensure referential integrity
- Consider proper cascade handling for deletions

---

*This documentation is automatically generated and updated when database changes occur.*
`;
  }

  async saveDocumentation() {
    try {
      const documentation = await this.generateDocumentation();
      await fs.writeFile(this.docPath, documentation, 'utf8');
      console.log('✅ Database documentation saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Error saving database documentation:', error);
      return false;
    }
  }
}

module.exports = DatabaseDocumentationGenerator;