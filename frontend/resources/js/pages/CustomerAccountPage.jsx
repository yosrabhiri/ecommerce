import { CreditCard, PackageCheck, ReceiptText, ShoppingBag, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LoadingState } from '../components/LoadingState';
import { fetchAccountSummary } from '../services/accountApi';

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
      <div className="account-hero">
        <div>
          <span><UserRound size={16} /> Customer account</span>
          <h1>Welcome back, {accountUser.name}</h1>
          <p>Track your orders, payment history, and panier from your Maison Glow account.</p>
        </div>
      </div>

      <div className="account-stats">
        <AccountStat icon={CreditCard} label="Total spent" value={`$${Number(stats.totalSpent).toFixed(2)}`} />
        <AccountStat icon={ReceiptText} label="Orders" value={stats.orders} />
        <AccountStat icon={PackageCheck} label="Paid orders" value={stats.paidOrders} />
        <AccountStat icon={ShoppingBag} label="Cart items" value={stats.cartItems} />
      </div>

      <div className="account-grid">
        <section className="account-panel">
          <div className="account-panel-header">
            <h2>Recent orders</h2>
            <button onClick={onContinueShopping}>Shop</button>
          </div>
          {summary.orders.length > 0 ? (
            <div className="account-order-list">
              {summary.orders.map((order) => (
                <article className="account-order" key={order.id}>
                  <div>
                    <strong>{order.items[0]?.product_name || order.order_number}</strong>
                    <span>
                      {order.items[0]
                        ? `Qty ${order.items[0].quantity} - $${Number(order.items[0].line_total).toFixed(2)}`
                        : `${order.items.length} item(s)`}
                    </span>
                  </div>
                  <div>
                    <span className={`account-badge ${order.payment_status}`}>{order.payment_status}</span>
                    <strong>${Number(order.total).toFixed(2)}</strong>
                  </div>
                  <div className="account-order-items">
                    {order.items.slice(0, 3).map((item) => (
                      <div className="account-order-item" key={item.id}>
                        <img
                          src={item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80'}
                          alt={item.product?.images?.[0]?.alt || item.product_name}
                        />
                      </div>
                    ))}
                  </div>
                  {order.payment_status !== 'paid' && (
                    <button className="secondary-button" onClick={() => onPayOrder(order)}>
                      Pay order
                    </button>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="account-empty">No orders yet. Your purchases will appear here after checkout.</p>
          )}
        </section>

        <section className="account-panel">
          <div className="account-panel-header">
            <h2>Payments</h2>
          </div>
          {summary.payments.length > 0 ? (
            <table className="account-table">
              <tbody>
                {summary.payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <strong>{payment.transaction_reference}</strong>
                      <span>{payment.card_brand} **** {payment.card_last_four}</span>
                    </td>
                    <td>${Number(payment.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="account-empty">No payments yet. Paid orders will create payment records here.</p>
          )}
        </section>
      </div>
    </section>
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
