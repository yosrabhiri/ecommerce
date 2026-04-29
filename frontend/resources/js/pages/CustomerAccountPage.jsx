import {
  CreditCard,
  PackageCheck,
  ReceiptText,
  ShoppingBag,
  UserRound,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { LoadingState } from '../components/LoadingState';
import { fetchAccountSummary } from '../services/accountApi';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function CustomerAccountPage({ user, onPayOrder, onContinueShopping }) {
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setStatus('loading');
    setMessage(null);

    fetchAccountSummary()
      .then((payload) => {
        setSummary(payload);
        setStatus('ready');
      })
      .catch((error) => {
        setMessage(error.message);
        setStatus('error');
      });
  }, []);

  if (status === 'loading') {
    return <LoadingState title="Loading account" message="Collecting your orders and payments..." />;
  }

  if (status === 'error') {
    return (
      <section className="account-state">
        <strong>Account request failed</strong>
        <span>{message}</span>
      </section>
    );
  }

  const stats = summary.stats;
  const accountUser = summary.user || user;

  return (
    <section className="customer-account">
      {/* Hero */}
      <div className="account-hero">
        <div>
          <span><UserRound size={13} /> Customer account</span>
          <h1>Welcome back, {accountUser.name}</h1>
          <p>Track your orders and payments from your Maison Glow account.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="account-stats">
        <AccountStat icon={CreditCard}    label="Total spent"  value={`$${Number(stats.totalSpent).toFixed(2)}`} />
        <AccountStat icon={ReceiptText}   label="Orders"       value={stats.orders} />
        <AccountStat icon={PackageCheck}  label="Paid"         value={stats.paidOrders} />
        <AccountStat icon={ShoppingBag}   label="Cart items"   value={stats.cartItems} />
      </div>

      {/* Main grid */}
      <div className="account-grid">
        {/* Orders */}
        <section className="account-panel">
          <div className="account-panel-header">
            <h2>Recent orders</h2>
            <button onClick={onContinueShopping}>Shop</button>
          </div>

          {summary.orders.length === 0 ? (
            <p className="account-empty">No orders yet. Your purchases will appear here after checkout.</p>
          ) : (
            <div className="order-list">
              {summary.orders.map((order) => (
                <OrderCard key={order.id} order={order} onPayOrder={onPayOrder} />
              ))}
            </div>
          )}
        </section>

        {/* Payments */}
        <section className="account-panel">
          <div className="account-panel-header">
            <h2>Payments</h2>
          </div>

          {summary.payments.length === 0 ? (
            <p className="account-empty">No payments yet. Paid orders will create payment records here.</p>
          ) : (
            <div className="payment-list">
              {summary.payments.map((payment) => (
                <PaymentRow key={payment.id} payment={payment} />
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

function OrderCard({ order, onPayOrder }) {
  const isPaid = order.payment_status === 'paid';
  const images = order.items
    .map((item) => ({
      url: item.product?.images?.[0]?.url || FALLBACK_IMG,
      alt: item.product_name,
    }))
    .slice(0, 4);

  const extraCount = order.items.length - images.length;

  return (
    <article className="order-card">
      {/* Card header */}
      <div className="order-card-header">
        <div className="order-card-meta">
          <strong className="order-card-number">{order.order_number}</strong>
          <span className="order-card-date">{formatDate(order.created_at)}</span>
        </div>
        <OrderStatusBadge status={order.payment_status} />
      </div>

      {/* Thumbnails */}
      <div className="order-card-thumbs">
        {images.map((img, i) => (
          <img key={i} src={img.url} alt={img.alt} className="order-thumb" />
        ))}
        {extraCount > 0 && (
          <div className="order-thumb-more">+{extraCount}</div>
        )}
      </div>

      {/* Items list */}
      <div className="order-card-items">
        {order.items.map((item) => (
          <div className="order-card-item" key={item.id}>
            <span className="order-item-name">{item.product_name}</span>
            <span className="order-item-qty">× {item.quantity}</span>
            <strong className="order-item-price">${Number(item.line_total).toFixed(2)}</strong>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="order-card-footer">
        <div className="order-card-total">
          <span>Total</span>
          <strong>${Number(order.total).toFixed(2)}</strong>
        </div>
        {!isPaid && (
          <button className="order-pay-btn" onClick={() => onPayOrder(order)}>
            Pay now
          </button>
        )}
      </div>
    </article>
  );
}

function OrderStatusBadge({ status }) {
  const isPaid = status === 'paid';
  return (
    <span className={`order-status-badge ${isPaid ? 'paid' : 'pending'}`}>
      {isPaid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
      {status}
    </span>
  );
}

function PaymentRow({ payment }) {
  return (
    <div className="payment-row-item">
      <div className="payment-row-card">
        <CreditCard size={15} />
        <div>
          <strong>{payment.card_brand} •••• {payment.card_last_four}</strong>
          <span>{payment.transaction_reference}</span>
        </div>
      </div>
      <div className="payment-row-right">
        <strong className="payment-row-amount">${Number(payment.amount).toFixed(2)}</strong>
        <span className="payment-row-date">{formatDate(payment.created_at)}</span>
      </div>
    </div>
  );
}

function AccountStat({ icon: Icon, label, value }) {
  return (
    <div className="account-stat">
      <Icon size={19} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
