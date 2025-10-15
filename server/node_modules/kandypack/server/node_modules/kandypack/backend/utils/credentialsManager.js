const fs = require('fs').promises;
const path = require('path');

/**
 * Updates the LOGIN_CREDENTIALS.md file with new customer credentials
 * @param {Object} customerData - The customer data object
 * @param {string} customerData.user_name - Customer username
 * @param {string} customerData.name - Customer full name
 * @param {string} plainPassword - The plain text password (before hashing)
 */
async function updateCredentialsFile(customerData, plainPassword) {
  try {
    const credentialsPath = path.join(__dirname, '../../LOGIN_CREDENTIALS.md');
    
    // Read the current file
    let content = await fs.readFile(credentialsPath, 'utf8');
    
    // Check if there's already a registered customers section
    const registeredCustomersHeader = '## 📋 Registered Customers';
    
    if (!content.includes(registeredCustomersHeader)) {
      // Add the registered customers section before the "How to Login" section
      const howToLoginIndex = content.indexOf('## 🚀 How to Login');
      if (howToLoginIndex !== -1) {
        const newSection = `
${registeredCustomersHeader}

### ${customerData.name}
- **Username:** \`${customerData.user_name}\`
- **Password:** \`${plainPassword}\`
- **Customer ID:** \`${customerData.customer_id}\`
- **Registration Date:** ${new Date().toLocaleDateString()}

`;
        content = content.slice(0, howToLoginIndex) + newSection + content.slice(howToLoginIndex);
      }
    } else {
      // Add to existing registered customers section
      const sectionIndex = content.indexOf(registeredCustomersHeader);
      const nextSectionIndex = content.indexOf('## 🚀 How to Login');
      
      const newCustomerEntry = `
### ${customerData.name}
- **Username:** \`${customerData.user_name}\`
- **Password:** \`${plainPassword}\`
- **Customer ID:** \`${customerData.customer_id}\`
- **Registration Date:** ${new Date().toLocaleDateString()}
`;
      
      // Insert before the "How to Login" section
      content = content.slice(0, nextSectionIndex) + newCustomerEntry + '\n' + content.slice(nextSectionIndex);
    }
    
    // Write the updated content back to the file
    await fs.writeFile(credentialsPath, content, 'utf8');
    
    console.log(`✅ LOGIN_CREDENTIALS.md updated with new customer: ${customerData.user_name}`);
    return true;
    
  } catch (error) {
    console.error('❌ Error updating LOGIN_CREDENTIALS.md:', error);
    return false;
  }
}

/**
 * Removes a customer from the credentials file (for cleanup)
 * @param {string} username - The username to remove
 */
async function removeCustomerFromCredentials(username) {
  try {
    const credentialsPath = path.join(__dirname, '../../LOGIN_CREDENTIALS.md');
    let content = await fs.readFile(credentialsPath, 'utf8');
    
    // Find and remove the customer section
    const userSectionRegex = new RegExp(`### [^\\n]*\\n(?:- \\*\\*[^\\n]*\\n)*(?=###|## |$)`, 'g');
    
    content = content.replace(userSectionRegex, (match) => {
      if (match.includes(`\`${username}\``)) {
        return ''; // Remove this customer's section
      }
      return match; // Keep other customers
    });
    
    await fs.writeFile(credentialsPath, content, 'utf8');
    console.log(`✅ Removed customer ${username} from LOGIN_CREDENTIALS.md`);
    return true;
    
  } catch (error) {
    console.error('❌ Error removing customer from LOGIN_CREDENTIALS.md:', error);
    return false;
  }
}

module.exports = {
  updateCredentialsFile,
  removeCustomerFromCredentials
};