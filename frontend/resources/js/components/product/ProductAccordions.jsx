export function ProductAccordions({ product }) {
  return (
    <div className="accordion-list">
      <details open>
        <summary>Description</summary>
        <p>{product.description || `A curated ${product.category.toLowerCase()} essential from ${product.brand}. Soft, polished, and selected to make your daily routine feel easier.`}</p>
      </details>
      <details>
        <summary>Ingredients and materials</summary>
        <p>Mock product information for the demo store. Backend product attributes can replace this later.</p>
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
