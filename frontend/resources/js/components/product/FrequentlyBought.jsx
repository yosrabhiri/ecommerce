export function FrequentlyBought({ products, onAdd, onSelect }) {
  return (
    <section className="frequently-bought">
      <h3>Frequently purchased <em>together</em></h3>
      {products.map((item) => (
        <article
          className="bundle-item"
          key={item.id}
          role="button"
          tabIndex={0}
          onClick={() => onSelect(item)}
          onKeyDown={(event) => event.key === 'Enter' && onSelect(item)}
        >
          <img src={item.image} alt={item.name} />
          <div>
            <p>{item.name}</p>
            <span>${item.price}</span>
          </div>
          <button onClick={(event) => {
            event.stopPropagation();
            onAdd(item);
          }}>
            Add to Cart
          </button>
        </article>
      ))}
    </section>
  );
}
