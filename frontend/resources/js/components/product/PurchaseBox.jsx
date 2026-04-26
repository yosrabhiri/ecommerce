import { useState } from 'react';

export function PurchaseBox({ product, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  const sizes = product.sizes?.length ? product.sizes : [product.category === 'Skincare' ? '30 ml' : 'Standard'];
  const colors = product.colors || [];

  const addQuantityToCart = () => {
    onAdd(product, quantity);
  };

  return (
    <>
      <div className="option-group">
        <p>{product.category === 'Skincare' ? 'Package size' : 'Size'}</p>
        <div className="pill-options">
          {sizes.slice(0, 5).map((size, index) => (
            <button key={size} className={index === 0 ? 'active' : ''}>{size}</button>
          ))}
        </div>
      </div>

      {colors.length > 0 && (
        <div className="option-group">
          <p>Color</p>
          <div className="pill-options">
            {colors.slice(0, 5).map((color, index) => (
              <button key={color} className={index === 0 ? 'active' : ''}>{color}</button>
            ))}
          </div>
        </div>
      )}

      <div className="buy-row">
        <div className="quantity-stepper" aria-label="Quantity">
          <button onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
          <strong>{quantity}</strong>
          <button onClick={() => setQuantity((value) => value + 1)}>+</button>
        </div>
        <button className="primary-button add-cart-wide" onClick={addQuantityToCart}>Add to Cart</button>
      </div>
    </>
  );
}
