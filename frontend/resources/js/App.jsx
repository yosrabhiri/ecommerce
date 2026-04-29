import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CartDrawer } from './components/cart/CartDrawer';
import { Header } from './components/Header';
import { LoadingState } from './components/LoadingState';
import { MobileDrawer } from './components/MobileDrawer';
import { AuthPage } from './pages/AuthPage';
import { PaymentPage } from './pages/PaymentPage';
import { ProductPage } from './pages/ProductPage';
import { ShopPage } from './pages/ShopPage';
import { WishlistDrawer } from './components/WishlistDrawer';
import { fetchCurrentUser, logoutAccount } from './services/authApi';
import { addCartItem, deleteCartItem, fetchCart, updateCartItem } from './services/cartApi';
import { createCheckout } from './services/checkoutApi';
import { fetchOrder } from './services/paymentApi';
import { fetchFilters, fetchProduct, fetchProducts } from './services/productsApi';
import '../css/app.css';

function getProductIdFromPath() {
  const match = window.location.pathname.match(/^\/products\/(\d+)/);
  return match ? Number(match[1]) : null;
}

function isAccountPath() {
  return window.location.pathname === '/account';
}

function getPaymentOrderIdFromPath() {
  const match = window.location.pathname.match(/^\/payment\/(\d+)/);
  return match ? Number(match[1]) : null;
}

function App() {
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState(emptyFilters);
  const [shopFilters, setShopFilters] = useState({
    category: 'All',
    brands: [],
    tags: [],
    priceRange: null,
    sort: 'featured',
    search: '',
  });
  const [selectedProductId, setSelectedProductId] = useState(getProductIdFromPath());
  const [accountOpen, setAccountOpen] = useState(isAccountPath());
  const [paymentOrderId, setPaymentOrderId] = useState(getPaymentOrderIdFromPath());
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(paymentOrderId ? 'loading' : 'idle');
  const [paymentError, setPaymentError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [checkoutStatus, setCheckoutStatus] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [cartStatus, setCartStatus] = useState(null);
  const [catalogStatus, setCatalogStatus] = useState('loading');
  const [catalogError, setCatalogError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productStatus, setProductStatus] = useState(selectedProductId ? 'loading' : 'idle');
  const [productError, setProductError] = useState(null);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [staticPage, setStaticPage] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('mg_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mg_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  useEffect(() => {
    fetchCurrentUser()
      .then((payload) => setAuthUser(payload?.user || null))
      .catch(() => setAuthUser(null));
  }, []);

  useEffect(() => {
    fetchCart()
      .then((payload) => setCart(payload.items))
      .catch((error) => setCartStatus(error.message));
  }, []);

  useEffect(() => {
    fetchFilters()
      .then(setFilterOptions)
      .catch(() => {
        setFilterOptions(emptyFilters);
        setCatalogStatus('error');
        setCatalogError('Backend is offline. Start Laravel to load filters and products.');
      });
  }, []);

  useEffect(() => {
    setCatalogStatus('loading');

    fetchProducts()
      .then((products) => {
        setAllProducts(products);
        setCatalogProducts(products);
        setCatalogStatus('ready');
        setCatalogError(null);
      })
      .catch(() => {
        setAllProducts([]);
        setCatalogProducts([]);
        setCatalogStatus('error');
        setCatalogError('Backend is offline. Start Laravel to load products.');
      });
  }, []);

  useEffect(() => {
    setCatalogStatus('loading');

    fetchProducts(shopFilters)
      .then((products) => {
        setCatalogProducts(products);
        setCatalogStatus('ready');
        setCatalogError(null);
      })
      .catch(() => {
        setCatalogProducts([]);
        setCatalogStatus('error');
        setCatalogError('Backend is offline. Filters and products need the Laravel API.');
      });
  }, [shopFilters]);

  useEffect(() => {
    const handlePopState = () => {
      setSelectedProductId(getProductIdFromPath());
      setAccountOpen(isAccountPath());
      setPaymentOrderId(getPaymentOrderIdFromPath());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!paymentOrderId) {
      setPaymentOrder(null);
      setPaymentStatus('idle');
      setPaymentError(null);
      return;
    }

    setPaymentStatus('loading');
    setPaymentError(null);

    fetchOrder(paymentOrderId)
      .then((payload) => {
        setPaymentOrder(payload.order);
        setPaymentStatus('ready');
      })
      .catch((error) => {
        setPaymentOrder(null);
        setPaymentStatus('error');
        setPaymentError(error.message);
      });
  }, [paymentOrderId]);

  useEffect(() => {
    if (!selectedProductId) {
      setSelectedProduct(null);
      setProductStatus('idle');
      setProductError(null);
      return;
    }

    setProductStatus('loading');
    setProductError(null);

    fetchProduct(selectedProductId)
      .then((product) => {
        setSelectedProduct(product);
        setProductStatus('ready');
      })
      .catch(() => {
        setSelectedProduct(null);
        setProductStatus('error');
        setProductError('Backend is offline or this product does not exist.');
      });
  }, [selectedProductId]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const openProduct = (product) => {
    window.history.pushState(null, '', `/products/${product.id}`);
    setAccountOpen(false);
    setPaymentOrderId(null);
    setSelectedProductId(product.id);
  };

  const goHome = () => {
    window.history.pushState(null, '', '/');
    setAccountOpen(false);
    setPaymentOrderId(null);
    setSelectedProductId(null);
    setStaticPage(null);
    setShopFilters({
      category: 'All',
      brands: [],
      tags: [],
      priceRange: null,
      sort: 'featured',
      search: '',
    });
  };

  const handleSearch = (value) => {
    setShopFilters(prev => ({ ...prev, search: value }));
    if (selectedProductId || accountOpen || paymentOrderId) {
      goHome();
    }
  };

  const handleQuickFilter = (category, tag) => {
    setShopFilters({
      category,
      brands: [],
      tags: tag ? [tag] : [],
      priceRange: null,
      sort: 'featured',
      search: '',
    });
    if (selectedProductId || accountOpen || paymentOrderId) {
      window.history.pushState(null, '', '/');
      setAccountOpen(false);
      setPaymentOrderId(null);
      setSelectedProductId(null);
    }
  };

  const openAccount = () => {
    window.history.pushState(null, '', '/account');
    setSelectedProductId(null);
    setPaymentOrderId(null);
    setAccountOpen(true);
    setCartOpen(false);
  };

  const openPayment = (order) => {
    window.history.pushState(null, '', `/payment/${order.id}`);
    setSelectedProductId(null);
    setAccountOpen(false);
    setPaymentOrderId(order.id);
    setPaymentOrder(order);
    setPaymentStatus('ready');
    setCartOpen(false);
  };

  const addToCart = async (product, quantity = 1) => {
    setCheckoutStatus(null);
    setCartStatus(null);

    try {
      const payload = await addCartItem(product.id, quantity);
      setCart(payload.items);
      setCartOpen(true);
    } catch (error) {
      setCartStatus(error.message);
    }
  };

  const removeFromCart = async (productId) => {
    setCheckoutStatus(null);
    setCartStatus(null);

    const item = cart.find((cartItem) => cartItem.product.id === productId);

    if (!item) {
      return;
    }

    try {
      const payload = item.quantity <= 1
        ? await deleteCartItem(productId)
        : await updateCartItem(productId, item.quantity - 1);

      setCart(payload.items);
    } catch (error) {
      setCartStatus(error.message);
    }
  };

  const deleteFromCart = async (productId) => {
    setCheckoutStatus(null);
    setCartStatus(null);

    try {
      const payload = await deleteCartItem(productId);
      setCart(payload.items);
    } catch (error) {
      setCartStatus(error.message);
    }
  };

  const checkout = () => {
    setCheckoutStatus(null);

    if (!authUser) {
      openAccount();
      return;
    }

    setCheckingOut(true);

    createCheckout(cart)
      .then((payload) => {
        setCart([]);
        openPayment(payload.order);
      })
      .catch((error) => setCheckoutStatus(error.message))
      .finally(() => setCheckingOut(false));
  };

  const handleAuthenticated = (user) => {
    setAuthUser(user);
    goHome();
  };

  const handlePaid = (order) => {
    setPaymentOrder(order);
    setPaymentStatus('ready');
  };

  const logout = async () => {
    await logoutAccount();
    setAuthUser(null);
    setCheckoutStatus('Signed out.');
    goHome();
  };

  const handleCategorySelect = (category) => {
    setShopFilters({
      category,
      brands: [],
      tags: [],
      priceRange: null,
      sort: 'featured',
      search: '',
    });
    goHome();
  };

  return (
    <main className="page-shell">
      <section className="storefront">
        <Header
          cartCount={cartCount}
          onOpenCart={() => setCartOpen(true)}
          onOpenMenu={() => setMobilePanelOpen(true)}
          onAccount={openAccount}
          onLogout={logout}
          isLoggedIn={Boolean(authUser)}
          onHome={goHome}
          onSearch={handleSearch}
          searchValue={shopFilters.search}
          categories={filterOptions.categories}
          onCategorySelect={handleCategorySelect}
          favoriteCount={favorites.length}
          onOpenWishlist={() => setWishlistOpen(true)}
          onQuickFilter={handleQuickFilter}
          onAbout={() => setStaticPage('about')}
          onMembership={() => setStaticPage('membership')}
        />

        {paymentOrderId && paymentStatus === 'loading' ? (
          <LoadingState
            title="Loading payment"
            message={`Requesting order #${paymentOrderId} from Laravel...`}
          />
        ) : paymentOrderId && paymentStatus === 'error' ? (
          <div className="catalog-state">
            <strong>Payment request failed</strong>
            <span>{paymentError}</span>
          </div>
        ) : paymentOrder ? (
          <PaymentPage order={paymentOrder} onPaid={handlePaid} />
        ) : accountOpen ? (
          <AuthPage cartCount={cartCount} onAuthenticated={handleAuthenticated} />
        ) : selectedProductId && productStatus === 'loading' ? (
          <LoadingState
            title="Loading product"
            message={`Requesting product #${selectedProductId} from Laravel...`}
          />
        ) : selectedProductId && productStatus === 'error' ? (
          <div className="catalog-state">
            <strong>Product request failed</strong>
            <button onClick={() => window.history.pushState(null, '', '/')}>Return home</button>
          </div>
        ) : staticPage === 'about' ? (
          <AboutPage onHome={goHome} />
        ) : staticPage === 'membership' ? (
          <MembershipPage onHome={goHome} />
        ) : selectedProduct ? (
          <ProductPage
            product={selectedProduct}
            products={allProducts}
            onBack={goHome}
            onAddToCart={addToCart}
            onSelectProduct={openProduct}
            isFavorite={favorites.includes(selectedProduct.id)}
            onToggleFavorite={toggleFavorite}
            favorites={favorites}
          />
        ) : (
          <ShopPage
            filters={filterOptions}
            selectedFilters={shopFilters}
            products={catalogProducts}
            onFiltersChange={setShopFilters}
            onSelectProduct={openProduct}
            onAddToCart={addToCart}
            status={catalogStatus}
            error={catalogError}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </section>

      {cartOpen && (
        <div className="drawer-overlay" onClick={(e) => e.target === e.currentTarget && setCartOpen(false)}>
          <CartDrawer
            cart={cart}
            onClose={() => setCartOpen(false)}
            onAdd={addToCart}
            onRemove={removeFromCart}
            onDelete={deleteFromCart}
            onCheckout={checkout}
            isCheckingOut={checkingOut}
            checkoutStatus={checkoutStatus || cartStatus}
          />
        </div>
      )}

      {mobilePanelOpen && (
        <MobileDrawer onClose={() => setMobilePanelOpen(false)} />
      )}

      {wishlistOpen && (
        <div className="drawer-overlay" onClick={(e) => e.target === e.currentTarget && setWishlistOpen(false)}>
          <WishlistDrawer
            isOpen={wishlistOpen}
            onClose={() => setWishlistOpen(false)}
            favorites={allProducts.filter(p => favorites.includes(p.id))}
            onAdd={addToCart}
            onRemove={toggleFavorite}
          />
        </div>
      )}
    </main>
  );
}

const emptyFilters = {
  categories: ['All'],
  brands: [],
  tags: [],
  priceRanges: [],
  sorts: [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Top Rated', value: 'rating_desc' },
  ],
};

createRoot(document.getElementById('root')).render(<App />);
