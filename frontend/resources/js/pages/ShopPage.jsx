import { ChevronDown, Filter, SlidersHorizontal } from 'lucide-react';
import { LoadingState } from '../components/LoadingState';
import { ProductCard } from '../components/product/ProductCard';

export function ShopPage({ filters, selectedFilters, products, onFiltersChange, onSelectProduct, onAddToCart, status, error }) {
  const toggleArrayFilter = (key, value) => {
    const values = selectedFilters[key];
    const nextValues = values.includes(value)
      ? values.filter((item) => item !== value)
      : [...values, value];

    onFiltersChange({ ...selectedFilters, [key]: nextValues });
  };

  return (
    <>
      <section className="hero">
        <img
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1800&q=80"
          alt="Soft beauty and fashion editorial"
        />
        <div className="hero-copy">
          <p>Spring edit</p>
          <h1>Clothes & Skincare</h1>
          <span>Polished everyday pieces, clean formulas, and small luxuries for an easy routine.</span>
        </div>
      </section>

      <section className="tabs" aria-label="Product categories">
        {filters.categories.map((category) => (
          <button
            key={category}
            className={category === selectedFilters.category ? 'active' : ''}
            onClick={() => onFiltersChange({ ...selectedFilters, category })}
          >
            {category}
          </button>
        ))}
      </section>

      <section className="shop-controls">
        <button><Filter size={18} /> Filters</button>
        <p>Showing <strong>{products.length}</strong> products</p>
        <label className="sort-select">
          Sort
          <ChevronDown size={16} />
          <select
            value={selectedFilters.sort}
            onChange={(event) => onFiltersChange({ ...selectedFilters, sort: event.target.value })}
          >
            {filters.sorts.map((sort) => (
              <option key={sort.value} value={sort.value}>{sort.label}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="content-grid">
        <aside className="filters" aria-label="Filters">
          <h2><SlidersHorizontal size={18} /> Filters</h2>
          <div>
            <h3>Brands</h3>
            {filters.brands.map((brand) => (
              <label key={brand}>
                <input
                  type="checkbox"
                  checked={selectedFilters.brands.includes(brand)}
                  onChange={() => toggleArrayFilter('brands', brand)}
                />
                {brand}
              </label>
            ))}
          </div>
          <div>
            <h3>Price</h3>
            <label>
              <input
                type="radio"
                name="price-range"
                checked={!selectedFilters.priceRange}
                onChange={() => onFiltersChange({ ...selectedFilters, priceRange: null })}
              />
              All prices
            </label>
            {filters.priceRanges.map((range) => (
              <label key={range.label}>
                <input
                  type="radio"
                  name="price-range"
                  checked={selectedFilters.priceRange?.label === range.label}
                  onChange={() => onFiltersChange({ ...selectedFilters, priceRange: range })}
                />
                {range.label}
              </label>
            ))}
          </div>
          {filters.tags.length > 0 && (
            <div>
              <h3>Promo</h3>
              {filters.tags.map((tag) => (
                <label key={tag}>
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag)}
                    onChange={() => toggleArrayFilter('tags', tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
          )}
          <FilterGroup title="Sizes" items={filters.sizes} selected={selectedFilters.sizes} onToggle={(value) => toggleArrayFilter('sizes', value)} />
          <FilterGroup title="Colors" items={filters.colors} selected={selectedFilters.colors} onToggle={(value) => toggleArrayFilter('colors', value)} />
          <FilterGroup title="Material" items={filters.materials} selected={selectedFilters.materials} onToggle={(value) => toggleArrayFilter('materials', value)} />
          <FilterGroup title="Skin type" items={filters.skinTypes} selected={selectedFilters.skinTypes} onToggle={(value) => toggleArrayFilter('skinTypes', value)} />
          <FilterGroup title="Skin concern" items={filters.skinConcerns} selected={selectedFilters.skinConcerns} onToggle={(value) => toggleArrayFilter('skinConcerns', value)} />
          <FilterGroup title="Occasion" items={filters.occasions} selected={selectedFilters.occasions} onToggle={(value) => toggleArrayFilter('occasions', value)} />
          <FilterGroup title="Product tags" items={filters.productTags} selected={selectedFilters.productTags} onToggle={(value) => toggleArrayFilter('productTags', value)} />
          <div>
            <button className="clear-filters" onClick={() => onFiltersChange({
              category: 'All',
              brands: [],
              tags: [],
              sizes: [],
              colors: [],
              materials: [],
              skinTypes: [],
              skinConcerns: [],
              occasions: [],
              productTags: [],
              priceRange: null,
              sort: 'featured',
            })}>
              Clear filters
            </button>
          </div>
        </aside>

        {status === 'error' ? (
          <div className="catalog-state">
            <strong>Backend connection required</strong>
            <span>{error}</span>
          </div>
        ) : status === 'loading' && products.length === 0 ? (
          <LoadingState title="Loading catalog" message="Waiting for Laravel API..." />
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onAdd={onAddToCart}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function FilterGroup({ title, items = [], selected = [], onToggle }) {
  if (!items.length) {
    return null;
  }

  return (
    <div>
      <h3>{title}</h3>
      {items.map((item) => (
        <label key={item}>
          <input
            type="checkbox"
            checked={selected.includes(item)}
            onChange={() => onToggle(item)}
          />
          {item}
        </label>
      ))}
    </div>
  );
}
