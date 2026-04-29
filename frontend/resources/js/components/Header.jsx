import { ChevronDown, Heart, LogIn, LogOut, Menu, Search, ShoppingBag, User } from 'lucide-react';

export function Header({ cartCount, isLoggedIn, onOpenCart, onOpenMenu, onHome, onAccount, onLogout, onSearch, searchValue, categories = [], onCategorySelect, favoriteCount = 0, onOpenWishlist, onQuickFilter, onAbout, onMembership }) {
  return (
    <>
      <header className="topbar">
        <button className="logo logo-button" onClick={onHome}>
          <span>Maison</span>
          <strong>Glow</strong>
        </button>

        <label className="search-box">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search clothes, skincare, brands"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
          />
        </label>

        <nav className="utility-nav" aria-label="Utility">
          <button className="icon-button wishlist-btn" aria-label="Wishlist" onClick={onOpenWishlist}>
            <Heart size={19} fill={favoriteCount > 0 ? 'currentColor' : 'none'} />
            {favoriteCount > 0 && <span className="wishlist-badge">{favoriteCount}</span>}
          </button>
          <div className="account-menu">
            <button className="icon-button" aria-label="Account">
              <User size={20} />
            </button>
            <div className="account-popover">
              {isLoggedIn ? (
                <button onClick={onLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <button onClick={onAccount}>
                  <LogIn size={16} />
                  Login
                </button>
              )}
            </div>
          </div>
          <button className="cart-button" aria-label="Panier" onClick={onOpenCart}>
            <ShoppingBag size={19} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
        </nav>

        <button className="menu-button" onClick={onOpenMenu} aria-label="Open menu">
          <Menu size={23} />
        </button>
      </header>

      <nav className="category-nav" aria-label="Main" style ={{paddingTop:'15px'}}>
        {categories.filter(c => c !== 'All').map((category) => (
          <div key={category} className="nav-dropdown-wrapper">
            <button
              className="nav-item"
              onClick={() => onCategorySelect(category)}
            >
              {category}
              <ChevronDown size={14} />
            </button>
            <div className="nav-dropdown">
              <button onClick={() => onQuickFilter(category, null)}>View All {category}</button>
              <button onClick={() => onQuickFilter(category, 'New')}>New Arrivals</button>
              <button onClick={() => onQuickFilter(category, 'Sale')}>Sale Items</button>
            </div>
          </div>
        ))}
        <button className="nav-item" onClick={onHome}>Discover</button>
      </nav>
    </>
  );
}
