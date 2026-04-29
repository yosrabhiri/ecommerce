import { X, ShoppingBag, Trash2 } from 'lucide-react';

export function WishlistDrawer({ isOpen, onClose, favorites, onAdd, onRemove }) {
  if (!isOpen) return null;

  return (
    <aside className="cart-drawer" aria-label="Wishlist">
      <div className="drawer-header">
        <div>
          <p>Wishlist</p>
          <strong>{favorites.length} item(s)</strong>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Close wishlist">
          <X size={22} />
        </button>
      </div>

      {favorites.length === 0 ? (
        <p className="empty-cart">Your wishlist is empty.</p>
      ) : (
        <div className="cart-items">
          {favorites.map((product) => (
            <div className="cart-item" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div>
                <p>{product.name}</p>
                <span>${product.price}</span>
                <div className="quantity-controls">
                  <button className="add-to-cart-small" onClick={() => onAdd(product)} style={{ width: 'auto', padding: '0 10px', borderRadius: '4px' }}>
                    <ShoppingBag size={14} /> Add to Cart
                  </button>
                  <button className="delete-button" onClick={() => onRemove(product.id)} aria-label={`Remove ${product.name}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

