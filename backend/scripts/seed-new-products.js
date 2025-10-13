/*
 * Schema-aware product seeding for KandyPack
 * - Inserts 10 logistics/packaging products aligned with the project
 * - Detects legacy vs advanced schema (product_name/weight_per_item/volume_per_item vs name/space_consumption)
 * - Assigns copyright-safe image URLs when image_url column exists
 */

const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function detectSchema(connection) {
  const [columns] = await connection.execute('DESCRIBE product');
  const names = new Set(columns.map((c) => c.Field));
  return {
    hasProductName: names.has('product_name'),
    hasName: names.has('name'),
    hasSpace: names.has('space_consumption'),
    hasWeight: names.has('weight_per_item'),
    hasVolume: names.has('volume_per_item'),
    hasImageUrl: names.has('image_url'),
  };
}

function buildProducts() {
  // Source-of-truth list; script will map fields per schema variant
  return [
    {
      key: 'RAIL_BOX_L',
      title: 'Corrugated Shipping Box (Large)',
      desc: 'Heavy-duty corrugated box for rail & road shipments',
      price: 14.9,
      space: 1.2,
      weight: 1.1,
      volume: 0.08,
      category: 'Distribution Supplies',
      qty: 300,
    },
    {
      key: 'ECO_MAILER',
      title: 'Eco Mailer Bag (Biodegradable)',
      desc: 'Sustainable mailer bag ideal for lightweight deliveries',
      price: 0.49,
      space: 0.05,
      weight: 0.02,
      volume: 0.001,
      category: 'Distribution Supplies',
      qty: 2000,
    },
    {
      key: 'BUBBLE_WRAP_HD',
      title: 'Bubble Wrap Roll (Heavy-Duty)',
      desc: 'High-protection bubble wrap for fragile items',
      price: 18.5,
      space: 0.3,
      weight: 0.7,
      volume: 0.03,
      category: 'Supply Chain Securing',
      qty: 180,
    },
    {
      key: 'STRETCH_FILM',
      title: 'Stretch Wrap Film (Pallet)',
      desc: 'Industrial-grade stretch film for pallet stabilization',
      price: 22.0,
      space: 0.25,
      weight: 2.4,
      volume: 0.02,
      category: 'Supply Chain Securing',
      qty: 240,
    },
    {
      key: 'TAPE_ACRYLIC',
      title: 'Packing Tape (Acrylic, 48mm)',
      desc: 'Strong acrylic packing tape for long-haul distribution',
      price: 1.99,
      space: 0.02,
      weight: 0.25,
      volume: 0.001,
      category: 'Distribution Supplies',
      qty: 1500,
    },
    {
      key: 'VOID_FILL_PAPER',
      title: 'Void Fill Paper (Kraft)',
      desc: 'Eco-friendly void fill to prevent in-transit damage',
      price: 24.0,
      space: 0.4,
      weight: 2.8,
      volume: 0.06,
      category: 'Supply Chain Securing',
      qty: 220,
    },
    {
      key: 'PET_STRAP_KIT',
      title: 'Pallet Strapping Kit (PET)',
      desc: 'Durable PET strapping kit for pallet security',
      price: 49.0,
      space: 0.15,
      weight: 3.6,
      volume: 0.01,
      category: 'Supply Chain Securing',
      qty: 120,
    },
    {
      key: 'FRAGILE_LABELS',
      title: 'Fragile Warning Labels',
      desc: 'High-visibility labels for sensitive cargo',
      price: 0.09,
      space: 0.01,
      weight: 0.005,
      volume: 0.0002,
      category: 'Distribution Supplies',
      qty: 5000,
    },
    {
      key: 'THERMAL_LABELS_4x6',
      title: 'Thermal Shipping Labels (4x6)',
      desc: 'Smudge-free thermal labels for scanners and printers',
      price: 12.5,
      space: 0.02,
      weight: 0.3,
      volume: 0.002,
      category: 'Distribution Supplies',
      qty: 800,
    },
    {
      key: 'WAREHOUSE_BIN_S',
      title: 'Modular Warehouse Bin (Small)',
      desc: 'Stackable bin for smart warehouse picking',
      price: 7.9,
      space: 0.8,
      weight: 0.9,
      volume: 0.06,
      category: 'Distribution Supplies',
      qty: 450,
    },
  ];
}

function imageUrlFor(p, baseColor) {
  // Copyright-safe placeholders; seeded by product id
  const color = baseColor || '667eea';
  const text = encodeURIComponent(p.title.substring(0, 24));
  return `https://via.placeholder.com/400x300/${color}/ffffff?text=${text}`;
}

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kandypack',
    port: process.env.DB_PORT || 3306,
  });

  try {
    console.log('🔎 Detecting product table schema...');
    const schema = await detectSchema(connection);
    console.log('   Schema:', schema);

    const products = buildProducts();

    // Prepare INSERT per schema
    let insertSql;
    let mapper;
    if (schema.hasProductName || (schema.hasWeight && schema.hasVolume)) {
      // Legacy-like
      insertSql = `INSERT INTO product (product_id, product_name, description, price, weight_per_item, volume_per_item, category, available_quantity${schema.hasImageUrl ? ', image_url' : ''}) VALUES (?, ?, ?, ?, ?, ?, ?, ?${schema.hasImageUrl ? ', ?' : ''})`;
      mapper = (p) => [
        `PROD_${p.key}`,
        p.title,
        p.desc,
        p.price,
        p.weight,
        p.volume,
        p.category,
        p.qty,
        ...(schema.hasImageUrl ? [imageUrlFor(p)] : []),
      ];
    } else if (schema.hasName && schema.hasSpace) {
      // Advanced
      insertSql = `INSERT INTO product (product_id, name, description, price, space_consumption, category, available_quantity${schema.hasImageUrl ? ', image_url' : ''}) VALUES (?, ?, ?, ?, ?, ?, ?${schema.hasImageUrl ? ', ?' : ''})`;
      mapper = (p) => [
        `PROD_${p.key}`,
        p.title,
        p.desc,
        p.price,
        p.space,
        p.category,
        p.qty,
        ...(schema.hasImageUrl ? [imageUrlFor(p)] : []),
      ];
    } else {
      throw new Error('Unrecognized product schema. Expected legacy (product_name/weight_per_item/volume_per_item) or advanced (name/space_consumption).');
    }

    // Insert with idempotency: skip if product_id exists
    const [existingRows] = await connection.execute('SELECT product_id FROM product');
    const existingIds = new Set(existingRows.map((r) => r.product_id));

    let inserted = 0;
    for (const p of products) {
      const pid = `PROD_${p.key}`;
      if (existingIds.has(pid)) {
        console.log(`⏭️  Skipping ${pid} (already exists)`);
        continue;
      }
      await connection.execute(insertSql, mapper(p));
      console.log(`✅ Inserted ${pid} — ${p.title}`);
      inserted++;
    }

    console.log(`\n🎉 Done. Inserted ${inserted} new products.`);
    if (inserted === 0) {
      console.log('ℹ️  Nothing to insert. All seed products already exist.');
    }
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  seed().catch((err) => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  });
}

module.exports = { seed };
