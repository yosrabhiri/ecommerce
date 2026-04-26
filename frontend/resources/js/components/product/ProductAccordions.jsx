export function ProductAccordions({ product }) {
  return (
    <div className="accordion-list">
      <details open>
        <summary>Description</summary>
        <p>{product.description || `A curated ${product.category.toLowerCase()} essential from ${product.brand}. Soft, polished, and selected to make your daily routine feel easier.`}</p>
      </details>
      <details>
        <summary>Ingredients and materials</summary>
        <p>
          {[
            product.material && `Material/formula: ${product.material}`,
            product.skinType && `Skin type: ${product.skinType}`,
            product.skinConcern && `Concern: ${product.skinConcern}`,
            product.occasion && `Occasion: ${product.occasion}`,
          ].filter(Boolean).join('. ') || 'Product attributes are managed from the backend catalog.'}
        </p>
      </details>
      <details>
        <summary>Options</summary>
        <p>
          {[
            product.sizes?.length ? `Sizes: ${product.sizes.join(', ')}` : null,
            product.colors?.length ? `Colors: ${product.colors.join(', ')}` : null,
            product.productTags?.length ? `Tags: ${product.productTags.join(', ')}` : null,
          ].filter(Boolean).join('. ') || 'No extra options are available for this product.'}
        </p>
      </details>
      <details>
        <summary>Suggested use</summary>
        <p>Use as part of your everyday routine. Store in a cool, dry place.</p>
      </details>
      <details>
        <summary>Maison Glow standard</summary>
        <p>Chosen for a clean, premium ecommerce experience with simple shipping and easy returns.</p>
      </details>
    </div>
  );
}
