const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Product Image Generator
 * Automatically generates appropriate images for products based on category and name
 */

// Category-specific image configurations
const categoryImageConfigs = {
  'Electronics': {
    baseColor: '3B82F6', // Blue
    keywords: ['electronics', 'technology', 'gadget', 'device'],
    icons: ['📱', '💻', '🖥️', '⌚', '🎧']
  },
  'Fashion': {
    baseColor: 'EC4899', // Pink
    keywords: ['fashion', 'clothing', 'style', 'apparel'],
    icons: ['👕', '👗', '👔', '👠', '👜']
  },
  'Home & Garden': {
    baseColor: '10B981', // Green
    keywords: ['home', 'garden', 'furniture', 'decor'],
    icons: ['🏠', '🌿', '🪴', '🛋️', '🔧']
  },
  'Books': {
    baseColor: '8B5CF6', // Purple
    keywords: ['book', 'education', 'reading', 'literature'],
    icons: ['📚', '📖', '📝', '🎓', '📑']
  },
  'Sports': {
    baseColor: 'F59E0B', // Orange
    keywords: ['sports', 'fitness', 'exercise', 'athletic'],
    icons: ['⚽', '🏀', '🎾', '🏃', '🏋️']
  },
  'Rail Logistics': {
    baseColor: '6366F1', // Indigo
    keywords: ['rail', 'transport', 'logistics', 'cargo'],
    icons: ['🚂', '📦', '🚛', '🏭', '📋']
  },
  'Road Logistics': {
    baseColor: 'EF4444', // Red
    keywords: ['road', 'truck', 'delivery', 'shipping'],
    icons: ['🚛', '📦', '🛣️', '🚚', '📋']
  },
  'Supply Chain Securing': {
    baseColor: '059669', // Emerald
    keywords: ['secure', 'packaging', 'protection', 'wrap'],
    icons: ['🔒', '📦', '🛡️', '📋', '✅']
  },
  'Distribution Supplies': {
    baseColor: '7C3AED', // Violet
    keywords: ['distribution', 'supplies', 'packaging', 'materials'],
    icons: ['📦', '📋', '🏭', '🚛', '📊']
  }
};

// Default fallback configuration
const defaultConfig = {
  baseColor: '64748B', // Gray
  keywords: ['product', 'item', 'goods'],
  icons: ['📦', '🛍️', '🏷️', '💼', '🎁']
};

/**
 * Generate multiple image URL options for a product
 */
function generateImageUrls(product) {
  const config = categoryImageConfigs[product.category] || defaultConfig;
  const productName = product.product_name || 'Product';
  const encodedName = encodeURIComponent(productName);
  const randomIcon = config.icons[Math.floor(Math.random() * config.icons.length)];
  const productId = product.product_id;
  
  // Generate a seed based on product ID for consistent images
  const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return {
    // High-quality placeholder with category-specific styling
    primary: `https://via.placeholder.com/400x300/${config.baseColor}/ffffff?text=${encodedName}`,
    
    // Picsum photos with category-based seed for variety
    picsum: `https://picsum.photos/seed/${productId}/400/300`,
    
    // Alternative placeholder with icon
    withIcon: `https://via.placeholder.com/400x300/${config.baseColor}/ffffff?text=${randomIcon}+${encodedName.substring(0, 20)}`,
    
    // Lorem Picsum with grayscale filter for professional look
    professional: `https://picsum.photos/seed/${seed}/400/300?grayscale`,
    
    // Category-specific Unsplash-style URL (using LoremFlickr as alternative)
    categorySpecific: `https://loremflickr.com/400/300/${config.keywords[0]},${config.keywords[1]}`
  };
}

/**
 * Select the best image URL based on category and product type
 */
function selectBestImageUrl(product, imageUrls) {
  const category = product.category;
  const productName = product.product_name.toLowerCase();
  
  // For logistics categories, use professional placeholder images
  if (['Rail Logistics', 'Road Logistics', 'Supply Chain Securing', 'Distribution Supplies'].includes(category)) {
    return imageUrls.primary;
  }
  
  // For consumer categories, use more varied images
  if (['Electronics', 'Fashion', 'Home & Garden', 'Books', 'Sports'].includes(category)) {
    return imageUrls.picsum;
  }
  
  // Default to primary placeholder
  return imageUrls.primary;
}

/**
 * Update database with generated images
 */
async function updateProductImages() {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'kandypack'
    });

    console.log('🔄 Fetching products from database...');
    
    // Get all products
    const [products] = await connection.execute(`
      SELECT product_id, product_name, category, description, image_url 
      FROM product 
      ORDER BY product_id
    `);

    console.log(`📦 Found ${products.length} products`);
    
    if (products.length === 0) {
      console.log('ℹ️  No products found in database');
      return;
    }

    let updatedCount = 0;
    let skippedCount = 0;

    // Process each product
    for (const product of products) {
      // Skip if product already has an image
      if (product.image_url && product.image_url.trim() !== '') {
        console.log(`⏭️  Skipping ${product.product_id} - already has image: ${product.image_url}`);
        skippedCount++;
        continue;
      }

      // Generate image URLs
      const imageUrls = generateImageUrls(product);
      const selectedImageUrl = selectBestImageUrl(product, imageUrls);

      // Update database
      await connection.execute(
        'UPDATE product SET image_url = ? WHERE product_id = ?',
        [selectedImageUrl, product.product_id]
      );

      console.log(`✅ Updated ${product.product_id}: ${product.product_name}`);
      console.log(`   📷 Image: ${selectedImageUrl}`);
      console.log(`   🏷️  Category: ${product.category || 'Uncategorized'}`);
      
      updatedCount++;
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`   ✅ Updated: ${updatedCount} products`);
    console.log(`   ⏭️  Skipped: ${skippedCount} products (already had images)`);
    console.log(`   📦 Total: ${products.length} products`);

    // Show sample of updated products
    if (updatedCount > 0) {
      console.log('\n🖼️  Sample generated images:');
      const [updatedProducts] = await connection.execute(`
        SELECT product_id, product_name, category, image_url 
        FROM product 
        WHERE image_url IS NOT NULL 
        LIMIT 5
      `);
      
      updatedProducts.forEach(product => {
        console.log(`   ${product.product_id}: ${product.image_url}`);
      });
    }

  } catch (error) {
    console.error('❌ Error generating product images:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

/**
 * Create a backup image generation function for testing
 */
async function generateTestImages() {
  console.log('🧪 Testing image generation...');
  
  const testProducts = [
    { product_id: 'TEST_001', product_name: 'Test Electronics Device', category: 'Electronics' },
    { product_id: 'TEST_002', product_name: 'Test Fashion Item', category: 'Fashion' },
    { product_id: 'TEST_003', product_name: 'Test Rail Container', category: 'Rail Logistics' }
  ];

  testProducts.forEach(product => {
    const imageUrls = generateImageUrls(product);
    const selectedUrl = selectBestImageUrl(product, imageUrls);
    
    console.log(`\n📦 ${product.product_name} (${product.category})`);
    console.log(`   Primary: ${imageUrls.primary}`);
    console.log(`   Picsum: ${imageUrls.picsum}`);
    console.log(`   Selected: ${selectedUrl}`);
  });
}

/**
 * Force regenerate all images (even if they exist)
 */
async function forceRegenerateAllImages() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'kandypack'
    });

    console.log('🔄 Force regenerating ALL product images...');
    
    const [products] = await connection.execute(`
      SELECT product_id, product_name, category, description 
      FROM product 
      ORDER BY product_id
    `);

    console.log(`📦 Processing ${products.length} products`);
    
    for (const product of products) {
      const imageUrls = generateImageUrls(product);
      const selectedImageUrl = selectBestImageUrl(product, imageUrls);

      await connection.execute(
        'UPDATE product SET image_url = ? WHERE product_id = ?',
        [selectedImageUrl, product.product_id]
      );

      console.log(`✅ ${product.product_id}: ${selectedImageUrl}`);
    }

    console.log(`\n🎉 Successfully regenerated images for ${products.length} products!`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0] || 'update';

async function main() {
  console.log('🖼️  Product Image Generator');
  console.log('==========================\n');

  switch (command) {
    case 'test':
      await generateTestImages();
      break;
    case 'force':
      await forceRegenerateAllImages();
      break;
    case 'update':
    default:
      await updateProductImages();
      break;
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = {
  generateImageUrls,
  selectBestImageUrl,
  updateProductImages,
  forceRegenerateAllImages
};