export function FrequentlyBought({ products, onAdd }) {
  return (
    <section className="frequently-bought">
      <h3>Frequently purchased <em>together</em></h3>
      {products.map((item) => (
        <div className="bundle-item" key={item.id}>
          <img src={item.image} alt={item.name} />
          <div>
            <p>{item.name}</p>
            <span>${item.price}</span>
          </div>
          <button onClick={() => onAdd(item)}>Add to Cart</button>
        </div>
      ))}
    </section>
  );
}
