import { ArrowLeft, ShieldCheck } from 'lucide-react';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80';

export function CheckoutPage({ cart, onCheckout, isCheckingOut, checkoutStatus, onBack }) {
  const total = cart.reduce(
    (sum, item) => sum + item.quantity * Number(item.product.price),
    0,
  );

  return (
    <section className="checkout-page">
      <div className="checkout-panel">
        <div className="checkout-summary">
          <button className="breadcrumb-button" onClick={onBack}>
            ← Back to shop
          </button>
          <h1>Order summary</h1>

          {cart.length === 0 ? (
            <p className="checkout-empty">Your cart is empty.</p>
          ) : (
            <div className="checkout-items">
              {cart.map((item) => (
                <div className="checkout-item" key={item.product.id}>
                  <img
                    src={item.product.image || FALLBACK_IMAGE}
                    alt={item.product.name}
                  />
                  <div className="checkout-item-info">
                    <p>{item.product.name}</p>
                    <span>{item.product.brand}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <strong>${(Number(item.product.price) * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>
          )}

          <div className="checkout-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </div>

        <div className="checkout-action">
          <div className="checkout-action-content">
            <ShieldCheck size={42} className="checkout-shield" />
            <h2>Ready to pay?</h2>
            <p>Your order will be created and you'll be taken to the secure payment step.</p>

            {checkoutStatus && (
              <p className="auth-note error">{checkoutStatus}</p>
            )}

            <button
              className="primary-button auth-submit"
              onClick={onCheckout}
              disabled={isCheckingOut || cart.length === 0}
            >
              {isCheckingOut ? 'Creating order...' : 'Proceed to payment'}
            </button>

            <p className="auth-note">
              Demo payment — no real card is charged.
            </p>

            <button className="checkout-back-link" onClick={onBack}>
              <ArrowLeft size={14} /> Continue shopping
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
