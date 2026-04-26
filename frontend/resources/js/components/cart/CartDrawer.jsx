import { Trash2, X } from 'lucide-react';

export function CartDrawer({ cart, onClose, onAdd, onRemove, onDelete, onCheckout, isCheckingOut, checkoutStatus }) {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <aside className="cart-drawer" aria-label="Panier">
      <div className="drawer-header">
        <div>
          <p>Panier</p>
          <strong>{count} item(s)</strong>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Close panier">
          <X size={22} />
        </button>
      </div>

      {cart.length === 0 ? (
        <p className="empty-cart">Your panier is empty.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.product.id}>
              <img src={item.product.image} alt={item.product.name} />
              <div>
                <p>{item.product.name}</p>
                <span>${item.product.price}</span>
                <div className="quantity-controls">
                  <button onClick={() => onRemove(item.product.id)} aria-label={`Remove one ${item.product.name}`}>-</button>
                  <strong>{item.quantity}</strong>
                  <button onClick={() => onAdd(item.product)} aria-label={`Add one ${item.product.name}`}>+</button>
                  <button className="delete-button" onClick={() => onDelete(item.product.id)} aria-label={`Delete ${item.product.name}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="drawer-footer">
        <p><span>Total</span><strong>${total.toFixed(2)}</strong></p>
        {checkoutStatus && <span className="checkout-message">{checkoutStatus}</span>}
        <button className="primary-button" disabled={cart.length === 0 || isCheckingOut} onClick={onCheckout}>
          {isCheckingOut ? 'Creating order...' : 'Checkout'}
        </button>
      </div>
    </aside>
  );
}
