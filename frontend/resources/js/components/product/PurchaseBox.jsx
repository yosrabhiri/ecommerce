import { useState } from 'react';

export function PurchaseBox({ product, onAdd }) {
  const [quantity, setQuantity] = useState(1);

  const addQuantityToCart = () => {
    onAdd(product, quantity);
  };

  return (
    <>
      <div className="option-group">
        <p>Package quantity: <strong>{product.category === 'Skincare' ? '30 ml' : '1 piece'}</strong></p>
        <div className="pill-options">
          <button className="active">{product.category === 'Skincare' ? '30 ml' : 'Standard'}</button>
          <button>{product.category === 'Skincare' ? '60 ml' : 'Gift wrap'}</button>
        </div>
      </div>

      <div className="purchase-options">
        <label className="purchase-option active">
          <input type="radio" name="purchase" defaultChecked />
          <span>One-Time Purchase</span>
        </label>
        <label className="purchase-option">
          <input type="radio" name="purchase" />
          <span>Monthly Subscription & Save 5%</span>
          <small>Deliver every 30 days. You can pause, skip, or cancel anytime.</small>
        </label>
      </div>

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
