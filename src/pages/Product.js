// src/pages/ProductsPage.jsx
import React, { useMemo, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Cards from "../Components/Card.js"; 

// Demo data; swap with API later
const PRODUCTS = [
  {
    id: 1,
    title: "KandyPack Small Box",
    description: "200x150x100 mm – lightweight corrugated.",
    price: 3.5,
    category: "Boxes",
    image: "https://via.placeholder.com/400x250?text=Small+Box",
  },
  {
    id: 2,
    title: "KandyPack Medium Box",
    description: "400x300x200 mm – popular for general packing.",
    price: 6.9,
    category: "Boxes",
    image: "https://via.placeholder.com/400x250?text=Medium+Box",
  },
  {
    id: 3,
    title: "Stretch Wrap Roll",
    description: "Transparent 500mm x 300m – 23µ.",
    price: 12.0,
    category: "Wrap",
    image: "https://via.placeholder.com/400x250?text=Stretch+Wrap",
  },
  {
    id: 4,
    title: "Packing Tape",
    description: "48mm x 100m – hot-melt adhesive.",
    price: 2.2,
    category: "Tape",
    image: "https://via.placeholder.com/400x250?text=Packing+Tape",
  },
  {
    id: 5,
    title: "Bubble Wrap",
    description: "1000mm x 50m – medium bubble.",
    price: 9.9,
    category: "Wrap",
    image: "https://via.placeholder.com/400x250?text=Bubble+Wrap",
  },
];

export default function Product() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category)))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(p => {
      const matchesCat = category === "All" || p.category === category;
      const matchesQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
  }, [query, category]);

  function handleAdd(product, qty) {
    // TODO: replace with your cart logic
    alert(`Added ${qty} × ${product.title} ($${product.price.toFixed(2)} each)`);
  }

  function handleCardClick(product) {
    // Replace with add-to-cart, navigate to detail, etc.
    alert(`Clicked: ${product.title} — $${product.price.toFixed(2)}`);
  }

  return (
    <Container className="py-4">
      {/* Toolbar */}
      <div className="d-flex flex-column flex-md-row gap-2 justify-content-between align-items-md-center mb-3">
        <h1 className="m-0 fs-4">Products</h1>

        <div className="d-flex gap-2">
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ minWidth: 180 }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Form.Select>

          <Form.Control
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <Row>
        {filtered.map((p) => (
          <Col key={p.id} xs={12} sm={6} md={4} lg={3}>
            <Cards
              title={`${p.title} — $${p.price.toFixed(2)}`}
              description={p.description}
              image={p.image}
              
              max={99}              // set per product if you have stock info
              initialQty={1}
              onAdd={(qty) => handleAdd(p, qty)}
              buttonText="Add to cart"
              onClick={() => handleCardClick(p)}
            />
          </Col>
        ))}

        {filtered.length === 0 && (
          <Col>
            <div className="text-muted py-5 text-center">No products found.</div>
          </Col>
        )}
      </Row>
    </Container>
  );
}
