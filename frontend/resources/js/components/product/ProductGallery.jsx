import { useEffect, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

export function ProductGallery({ product, galleryImages, onBack }) {
  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    setActiveImage(galleryImages[0]);
    setZoomOpen(false);
  }, [galleryImages]);

  useEffect(() => {
    if (!zoomOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setZoomOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomOpen]);

  return (
    <div className="detail-gallery">
      <button className="breadcrumb-button" onClick={onBack}>Home / {product.name}</button>
      <div className="details-media">
        {product.tag && <span className={`tag ${product.tag.toLowerCase()}`}>{product.tag}</span>}
        <button className="zoom-button" aria-label="Zoom image" onClick={() => setZoomOpen(true)}>
          <ZoomIn size={18} />
        </button>
        <img src={activeImage} alt={product.name} />
      </div>
      <div className="thumbnail-row" aria-label="Product gallery">
        {galleryImages.map((image, index) => (
          <button
            className={image === activeImage ? 'active' : ''}
            key={`${image}-${index}`}
            onClick={() => setActiveImage(image)}
            aria-label={`View image ${index + 1}`}
          >
            <img src={image} alt="" />
          </button>
        ))}
      </div>
      {zoomOpen && (
        <div className="zoom-overlay" role="dialog" aria-modal="true" aria-label={`${product.name} zoomed image`}>
          <button className="zoom-close" aria-label="Close zoom" onClick={() => setZoomOpen(false)}>
            <X size={24} />
          </button>
          <img src={activeImage} alt={product.name} />
        </div>
      )}
    </div>
  );
}
