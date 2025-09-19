// src/pages/ProductsPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import Cards from "../Components/Card.js"; 
import { useStore } from "../context/StoreContext";

export default function Product() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();
  const { products, addToCart, cart } = useStore();

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map(p => p.category)))],
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(p => {
      const matchesCat = category === "All" || p.category === category;
      const matchesQ =
        !q ||
        p.title.toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
  }, [query, category, products]);

  function handleAdd(product, qty) {
    addToCart(product.id, qty);
  }

  function handleGoToCheckout() {
    navigate('/checkout');
  }

  return (
    <div>
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
              description={`Category: ${p.category}`}
              image={`https://via.placeholder.com/400x250?text=${encodeURIComponent(p.title)}`}
              
              max={99}              // set per product if you have stock info
              initialQty={1}
              onAdd={(qty) => handleAdd(p, qty)}
              buttonText="Add to cart"
              onClick={() => handleAdd(p, 1)}
            />
          </Col>
        ))}

        {filtered.length === 0 && (
          <Col>
            <div className="text-muted py-5 text-center">No products found.</div>
          </Col>
        )}
      </Row>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <div>Items in cart: <strong>{cart.reduce((s, i) => s + i.qty, 0)}</strong></div>
        <button className="btn btn-primary" onClick={handleGoToCheckout}>Go to Checkout</button>
      </div>
    </Container>
    
    </div>
  );
}
