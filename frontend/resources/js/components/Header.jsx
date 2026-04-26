import { ChevronDown, Heart, LayoutDashboard, LogIn, LogOut, Menu, Search, ShoppingBag, User } from 'lucide-react';

export function Header({ cartCount, isLoggedIn, isAdmin, onOpenCart, onOpenMenu, onHome, onAccount, onAdmin, onLogout }) {
  return (
    <>
      <header className="topbar">
        <button className="logo logo-button" onClick={onHome}>
          <span>Maison</span>
          <strong>Glow</strong>
        </button>

        <label className="search-box">
          <Search size={18} />
          <input type="search" placeholder="Search clothes, skincare, brands" />
        </label>

        <nav className="utility-nav" aria-label="Utility">
          <a href="#">About</a>
          <a href="#">Membership</a>
          <button className="currency">USD <ChevronDown size={14} /></button>
          <button className="icon-button" aria-label="Wishlist"><Heart size={19} /></button>
          <div className="account-menu">
            <button className="icon-button" aria-label="Account">
              <User size={19} />
            </button>
            <div className="account-popover">
              {isAdmin && (
                <button onClick={onAdmin}>
                  <LayoutDashboard size={16} />
                  Admin
                </button>
              )}
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

      <nav className="category-nav" aria-label="Main">
        {['New In', 'Clothing', 'Skincare', 'Body Care', 'Accessories', 'Our Brands', 'Discover'].map((item) => (
          <a href="#" key={item}>{item}<ChevronDown size={14} /></a>
        ))}
      </nav>
    </>
  );
}
