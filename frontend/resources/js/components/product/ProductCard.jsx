import { Heart } from 'lucide-react';
import { Rating } from '../Rating';

export function ProductCard({ product, onSelect, onAdd, isFavorite, onToggleFavorite }) {
  const handleAdd = (event) => {
    event.stopPropagation();
    onAdd(product);
  };

  const handleFavorite = (event) => {
    event.stopPropagation();
    onToggleFavorite(product.id);
  };

  return (
    <article
      className="product-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(product)}
      onKeyDown={(event) => event.key === 'Enter' && onSelect(product)}
    >
      <div className="product-media">
        {product.tag && <span className={`tag ${product.tag.toLowerCase()}`}>{product.tag}</span>}
        <button 
          className={`icon-button favorite ${isFavorite ? 'active' : ''}`} 
          aria-label={`Save ${product.name}`} 
          onClick={handleFavorite}
        >
          <Heart size={19} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-copy">
        <span className="brand">{product.brand}</span>
        <h3>{product.name}</h3>
        <Rating value={product.rating} label={product.rating} />
        <p className="price">
          From <strong>${product.price}</strong>
          {product.oldPrice && <span>${product.oldPrice}</span>}
        </p>
        <button className="add-button" onClick={handleAdd}>Add to Panier</button>
      </div>
    </article>
  );
}
