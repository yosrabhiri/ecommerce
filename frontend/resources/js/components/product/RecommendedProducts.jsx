import { Sparkles } from 'lucide-react';
import { ProductCard } from './ProductCard';

export function RecommendedProducts({ products, onSelect, onAdd, title = "Recommended for You", favorites = [], onToggleFavorite }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="recommended-products">
      <div className="recommended-header">
        <h3>{title}</h3>
        <span className="ai-badge">
          <Sparkles size={14} />
          AI Powered
        </span>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="recommended-item">
            <ProductCard
              product={product}
              onSelect={onSelect}
              onAdd={onAdd}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
            />
            {product.aiInsight && (
              <div className="ai-insight">
                <Sparkles size={12} />
                <span>{product.aiInsight}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
