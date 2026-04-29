import { CreditCard, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { payOrder } from '../services/paymentApi';

export function PaymentPage({ order, onPaid }) {
  const [form, setForm] = useState({
    cardholder_name: '',
    card_number: '',
    expiry: '',
    cvc: '',
  });
  const [status, setStatus] = useState(null);
  const [paying, setPaying] = useState(false);

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submitPayment = async (event) => {
    event.preventDefault();
    setPaying(true);
    setStatus(null);

    try {
      const payload = await payOrder(order.id, form);
      setStatus('Payment accepted.');
      onPaid(payload.order);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setPaying(false);
    }
  };

  return (
    <section className="payment-page">
      <div className="payment-panel">
        <div className="payment-summary">
          <ShieldCheck size={38} />
          <h1>Payment</h1>
          <p>Order <strong>{order.order_number}</strong></p>
          <div className="payment-total">
            <span>Total</span>
            <strong>${Number(order.total).toFixed(2)}</strong>
          </div>
          <div className="payment-lines">
            {order.items.map((item) => (
              <p key={item.id}>
                <span>{item.product_name} x {item.quantity}</span>
                <strong>${Number(item.line_total).toFixed(2)}</strong>
              </p>
            ))}
          </div>
        </div>

        <form className="payment-form" onSubmit={submitPayment}>
          <div className="payment-form-title">
            <CreditCard size={22} />
            <strong>Card details</strong>
          </div>
          <label>
            Cardholder name
            <input
              value={form.cardholder_name}
              onChange={(event) => updateForm('cardholder_name', event.target.value)}
              placeholder="Name on card"
              required
            />
          </label>
          <label>
            Card number
            <input
              value={form.card_number}
              onChange={(event) => updateForm('card_number', event.target.value)}
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
              required
            />
          </label>
          <div className="payment-row">
            <label>
              Expiry
              <input
                value={form.expiry}
                onChange={(event) => updateForm('expiry', event.target.value)}
                placeholder="MM/YY"
                required
              />
            </label>
            <label>
              CVC
              <input
                value={form.cvc}
                onChange={(event) => updateForm('cvc', event.target.value)}
                placeholder="123"
                inputMode="numeric"
                required
              />
            </label>
          </div>
          <button className="primary-button auth-submit" disabled={paying || order.payment_status === 'paid'}>
            {order.payment_status === 'paid' ? 'Paid' : (paying ? 'Processing...' : 'Pay now')}
          </button>
          <p className="auth-note">{status || 'Demo payment: no real card is charged.'}</p>
        </form>
      </div>
    </section>
  );
}
