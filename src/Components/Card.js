// src/components/Cards.jsx
import React, { useState } from "react";
import { Card, Button, InputGroup, Form } from "react-bootstrap";

export default function Cards({
  title,
  description,
  image,
  buttonText = "Add",
  onAdd,                // (qty:number) => void
  min = 1,
  max = 99,
  initialQty = 1,
}) {
  const [qty, setQty] = useState(
    Math.min(Math.max(initialQty, min), max)
  );

  const dec = () => setQty(q => Math.max(q - 1, min));
  const inc = () => setQty(q => Math.min(q + 1, max));

  const onQtyInput = (e) => {
    const v = e.target.value.replace(/\D/g, ""); // digits only
    const n = v === "" ? "" : Number(v);
    if (v === "") setQty(min);
    else setQty(Math.min(Math.max(n, min), max));
  };

  const handleAdd = () => {
    if (typeof onAdd === "function") onAdd(qty);
  };

  return (
    <Card style={{ width: "18rem", margin: "1rem" }}>
      {image && <Card.Img variant="top" src={image} alt={title} />}
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        {description && <Card.Text>{description}</Card.Text>}

        {/* Quantity selector */}
        <InputGroup className="mb-2" style={{ maxWidth: 220 }}>
          <Button
            variant="outline-secondary"
            onClick={dec}
            disabled={qty <= min}
            aria-label="Decrease quantity"
          >
            −
          </Button>
          <Form.Control
            value={qty}
            onChange={onQtyInput}
            inputMode="numeric"
            pattern="[0-9]*"
            className="text-center"
            aria-label="Quantity"
          />
          <Button
            variant="outline-secondary"
            onClick={inc}
            disabled={qty >= max}
            aria-label="Increase quantity"
          >
            +
          </Button>
        </InputGroup>

        <div className="d-grid">
          <Button variant="primary" onClick={handleAdd}>
            {buttonText}
          </Button>
        </div>

        <div className="text-muted mt-2" style={{ fontSize: 12 }}>
          Min {min} • Max {max}
        </div>
      </Card.Body>
    </Card>
  );
}
