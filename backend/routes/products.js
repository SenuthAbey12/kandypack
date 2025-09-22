const express = require('express');
const database = require('../config/database');

const router = express.Router();

// Get all products with pagination
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    let query = 'SELECT * FROM product';
    let countQuery = 'SELECT COUNT(*) as total FROM product';
    let params = [];
    let whereConditions = [];

    // Add category filter
    if (category && category !== 'all') {
      whereConditions.push('category = ?');
      params.push(category);
    }

    // Add search filter
    if (search) {
      whereConditions.push('(product_name LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    // Add WHERE clause if there are conditions
    if (whereConditions.length > 0) {
      const whereClause = ' WHERE ' + whereConditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

  const countParams = [...params];

  // Add pagination (inline numerics to avoid prepared stmt issues with LIMIT/OFFSET)
  const limitInt = Number.isFinite(limit) ? limit : parseInt(limit, 10) || 10;
  const offsetInt = Number.isFinite(offset) ? offset : parseInt(offset, 10) || 0;
  query += ` LIMIT ${limitInt} OFFSET ${offsetInt}`;

  console.log('Query:', query);
  console.log('Params (filters only):', params);

    try {
      // Try database query first
      const [products, [{ total }]] = await Promise.all([
        database.query(query, params),
        database.query(countQuery, countParams)
      ]);

      console.log('Database query successful, returning', products.length, 'products');
      console.log('Sample product with image:', products[0] ? {
        id: products[0].product_id,
        name: products[0].product_name,
        image_url: products[0].image_url
      } : 'No products');

      res.json({
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (dbError) {
      // Fallback to mock data when database is unavailable
      console.log('Database unavailable, using mock data for products. Error:', dbError.message);
      
      const mockProducts = [
        {
          product_id: 'PROD_001',
          product_name: 'Premium Electronics Package',
          description: 'High-quality electronics with fast rail/road delivery',
          price: 299.99,
          weight_per_item: 2.5,
          volume_per_item: 0.02,
          category: 'Electronics',
          available_quantity: 50,
          image_url: 'https://picsum.photos/seed/MOCK_001/400/300'
        },
        {
          product_id: 'PROD_002',
          product_name: 'Fashion Essentials',
          description: 'Trendy fashion accessories with supply chain optimization',
          price: 79.99,
          weight_per_item: 0.5,
          volume_per_item: 0.005,
          category: 'Fashion',
          available_quantity: 100,
          image_url: 'https://picsum.photos/seed/MOCK_002/400/300'
        },
        {
          product_id: 'PROD_003',
          product_name: 'Home & Garden Supplies',
          description: 'Essential home improvement items via logistics network',
          price: 149.99,
          weight_per_item: 5.0,
          volume_per_item: 0.1,
          category: 'Home & Garden',
          available_quantity: 25,
          image_url: 'https://picsum.photos/seed/MOCK_003/400/300'
        },
        {
          product_id: 'PROD_004',
          product_name: 'Books & Educational Media',
          description: 'Educational materials with rail transport efficiency',
          price: 29.99,
          weight_per_item: 0.8,
          volume_per_item: 0.003,
          category: 'Books',
          available_quantity: 75,
          image_url: 'https://picsum.photos/seed/MOCK_004/400/300'
        },
        {
          product_id: 'PROD_005',
          product_name: 'Sports Equipment',
          description: 'Quality sports gear via road distribution network',
          price: 199.99,
          weight_per_item: 3.2,
          volume_per_item: 0.05,
          category: 'Sports',
          available_quantity: 30,
          image_url: 'https://picsum.photos/seed/MOCK_005/400/300'
        }
      ];

      // Apply filters to mock data
      let filteredProducts = mockProducts;
      
      if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }
      
      if (search) {
        filteredProducts = filteredProducts.filter(p => 
          p.product_name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply pagination
      const total = filteredProducts.length;
      const startIndex = (page - 1) * limit;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

      res.json({
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [product] = await database.query(
      'SELECT * FROM product WHERE product_id = ?',
      [id]
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Add new product (Admin only)
router.post('/', async (req, res) => {
  try {
    const { 
      product_name, 
      description, 
      price, 
      weight_per_item, 
      volume_per_item, 
      category, 
      available_quantity 
    } = req.body;

    // Validate required fields
    if (!product_name || !price || !weight_per_item || !volume_per_item) {
      return res.status(400).json({ 
        error: 'Product name, price, weight, and volume are required' 
      });
    }

    // Generate product ID
    const product_id = `PROD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Insert new product
    await database.query(
      `INSERT INTO product (product_id, product_name, description, price, weight_per_item, volume_per_item, category, available_quantity) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [product_id, product_name, description, price, weight_per_item, volume_per_item, category, available_quantity || 0]
    );

    // Get the created product
    const [newProduct] = await database.query(
      'SELECT * FROM product WHERE product_id = ?',
      [product_id]
    );

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      product_name, 
      description, 
      price, 
      weight_per_item, 
      volume_per_item, 
      category, 
      available_quantity 
    } = req.body;

    // Check if product exists
    const [existingProduct] = await database.query(
      'SELECT product_id FROM product WHERE product_id = ?',
      [id]
    );

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update product
    await database.query(
      `UPDATE product SET 
       product_name = COALESCE(?, product_name),
       description = COALESCE(?, description),
       price = COALESCE(?, price),
       weight_per_item = COALESCE(?, weight_per_item),
       volume_per_item = COALESCE(?, volume_per_item),
       category = COALESCE(?, category),
       available_quantity = COALESCE(?, available_quantity)
       WHERE product_id = ?`,
      [product_name, description, price, weight_per_item, volume_per_item, category, available_quantity, id]
    );

    // Get updated product
    const [updatedProduct] = await database.query(
      'SELECT * FROM product WHERE product_id = ?',
      [id]
    );

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const [existingProduct] = await database.query(
      'SELECT product_id FROM product WHERE product_id = ?',
      [id]
    );

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete product
    await database.query(
      'DELETE FROM product WHERE product_id = ?',
      [id]
    );

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await database.query(
      'SELECT DISTINCT category FROM product WHERE category IS NOT NULL ORDER BY category'
    );

    res.json({
      categories: categories.map(row => row.category)
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;