import { useEffect, useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { FrequentlyBought } from '../components/product/FrequentlyBought';
import { ProductAccordions } from '../components/product/ProductAccordions';
import { ProductBenefits } from '../components/product/ProductBenefits';
import { ProductGallery } from '../components/product/ProductGallery';
import { PurchaseBox } from '../components/product/PurchaseBox';
import { RecommendedProducts } from '../components/product/RecommendedProducts';
import { fetchRecommendations } from '../services/productsApi';

export function ProductPage({ product, products, onBack, onAddToCart, onSelectProduct, isFavorite, onToggleFavorite, favorites = [] }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchRecommendations(product.id)
      .then(setRecommendations)
      .catch(() => setRecommendations([]));
  }, [product.id]);

  const galleryImages = product.images?.length ? product.images : [product.image];
  const relatedProducts = products
    .filter((item) => item.id !== product.id && item.category !== product.category)
    .slice(0, 2);

  return (
    <>
      <section className="product-details">
        <ProductGallery product={product} galleryImages={galleryImages} onBack={onBack} />

        <div className="details-copy">
          <button
            className={`icon-button detail-heart ${isFavorite ? 'active' : ''}`}
            aria-label={`Save ${product.name}`}
            onClick={() => onToggleFavorite(product.id)}
          >
            <Heart size={21} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <h2>{product.name}</h2>
          <p className="byline">by <strong>{product.brand}</strong></p>
          <div className="details-rating" aria-label={`${product.rating} out of 5`}>
            <span>{product.rating}</span>
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} size={15} fill={index < Math.round(product.rating) ? 'currentColor' : 'none'} />
            ))}
            <a href="#">8,023 reviews</a>
          </div>
          <p className="details-price">
            ${product.price}
            {product.oldPrice && <span>${product.oldPrice}</span>}
          </p>

          <PurchaseBox product={product} onAdd={onAddToCart} />
          <ProductBenefits />
          <ProductAccordions product={product} />
          <FrequentlyBought products={relatedProducts} onAdd={onAddToCart} onSelect={onSelectProduct} />
        </div>
      </section>

      <div className="product-recommendations-wrapper">
        <RecommendedProducts
          products={recommendations}
          onSelect={onSelectProduct}
          onAdd={onAddToCart}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    </>
  );
}
