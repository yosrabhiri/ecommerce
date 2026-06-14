import { CheckCircle, MailCheck, Package, ReceiptText } from 'lucide-react';

export function PaymentSuccessPage({ order, onContinueShopping, onAccount }) {
  return (
    <section className="success-page">
      <div className="success-panel">
        <div className="success-icon">
          <CheckCircle size={52} />
        </div>

        <h1>Payment confirmed</h1>
        <p className="success-tagline">
          Thank you for your order. Your payment has been processed successfully.
        </p>

        {order && (
          <div className="success-order">
            <div className="success-order-header">
              <Package size={16} />
              <strong>{order.order_number}</strong>
              <span className="account-badge paid">{order.payment_status}</span>
            </div>

            <div className="success-order-total">
              <span>Total paid</span>
              <strong>${Number(order.total).toFixed(2)}</strong>
            </div>

            {order.items?.length > 0 && (
              <div className="success-order-items">
                {order.items.map((item) => (
                  <div className="success-order-item" key={item.id}>
                    <span className="success-item-name">{item.product_name}</span>
                    <span className="success-item-qty">× {item.quantity}</span>
                    <strong>${Number(item.line_total).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            )}

            {order.payments?.[0] && (
              <div className="success-receipt">
                <p>
                  <ReceiptText size={15} />
                  <span>Transaction</span>
                  <strong>{order.payments[0].transaction_reference}</strong>
                </p>
                <p>
                  <span>Card</span>
                  <strong>
                    {order.payments[0].card_brand} **** {order.payments[0].card_last_four}
                  </strong>
                </p>
                <p>
                  <MailCheck size={15} />
                  <span>Receipt</span>
                  <strong>
                    {order.receipt_sent === false
                      ? 'Email pending'
                      : `Sent to ${order.receipt_email || 'your email'}`}
                  </strong>
                </p>
              </div>
            )}
          </div>
        )}

        <div className="success-actions">
          <button className="primary-button" onClick={onAccount}>
            View payment history
          </button>
          <button className="secondary-button" onClick={onContinueShopping}>
            Continue shopping
          </button>
        </div>
      </div>
    </section>
  );
}
