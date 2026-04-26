import { BarChart3, CreditCard, Package, ReceiptText, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LoadingState } from '../components/LoadingState';
import {
  fetchAdminDashboard,
  fetchAdminOrders,
  fetchAdminPayments,
  fetchAdminProducts,
  fetchAdminUsers,
  updateAdminOrder,
  updateAdminProduct,
} from '../services/adminApi';

const tabs = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'orders', label: 'Orders', icon: ReceiptText },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'payments', label: 'Payments', icon: CreditCard },
];

export function AdminPage({ user, onAccount }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboard, setDashboard] = useState(null);
  const [lists, setLists] = useState({ products: [], orders: [], users: [], payments: [] });
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState(null);

  const isAdmin = Boolean(user?.is_admin);

  useEffect(() => {
    if (!isAdmin) {
      setStatus('ready');
      return;
    }

    setStatus('loading');
    setMessage(null);

    Promise.all([
      fetchAdminDashboard(),
      fetchAdminProducts(),
      fetchAdminOrders(),
      fetchAdminUsers(),
      fetchAdminPayments(),
    ])
      .then(([dashboardPayload, productsPayload, ordersPayload, usersPayload, paymentsPayload]) => {
        setDashboard(dashboardPayload);
        setLists({
          products: productsPayload.products.data,
          orders: ordersPayload.orders.data,
          users: usersPayload.users.data,
          payments: paymentsPayload.payments.data,
        });
        setStatus('ready');
      })
      .catch((error) => {
        setMessage(error.message);
        setStatus('error');
      });
  }, [isAdmin]);

  const toggleProduct = async (product) => {
    const payload = await updateAdminProduct(product.id, { is_active: !product.is_active });
    setLists((current) => ({
      ...current,
      products: current.products.map((item) => (item.id === product.id ? payload.product : item)),
    }));
  };

  const saveStock = async (product, stock) => {
    const payload = await updateAdminProduct(product.id, { stock: Number(stock) });
    setLists((current) => ({
      ...current,
      products: current.products.map((item) => (item.id === product.id ? payload.product : item)),
    }));
  };

  const changeOrderStatus = async (order, statusValue) => {
    const payload = await updateAdminOrder(order.id, statusValue);
    setLists((current) => ({
      ...current,
      orders: current.orders.map((item) => (item.id === order.id ? payload.order : item)),
    }));
  };

  if (!user) {
    return (
      <section className="admin-gate">
        <strong>Admin access</strong>
        <span>Sign in with the admin account to view products, orders, users, and payments.</span>
        <button className="primary-button" onClick={onAccount}>Login</button>
        <small>Demo admin: admin@maisonglow.test / password123</small>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="admin-gate">
        <strong>Admin access required</strong>
        <span>Your current account does not have admin permissions.</span>
      </section>
    );
  }

  if (status === 'loading') {
    return <LoadingState title="Loading admin" message="Preparing dashboard metrics..." />;
  }

  if (status === 'error') {
    return (
      <section className="admin-gate">
        <strong>Admin request failed</strong>
        <span>{message}</span>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <aside className="admin-sidebar">
        <div>
          <span>Maison Glow</span>
          <strong>Admin</strong>
        </div>
        <nav aria-label="Admin sections">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} className={activeTab === key ? 'active' : ''} onClick={() => setActiveTab(key)}>
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="admin-content">
        <header className="admin-header">
          <div>
            <p>Dashboard</p>
            <h1>{tabs.find((tab) => tab.key === activeTab)?.label}</h1>
          </div>
          <span>{user.name}</span>
        </header>

        {activeTab === 'overview' && <Overview dashboard={dashboard} />}
        {activeTab === 'orders' && <OrdersTable orders={lists.orders} onChangeStatus={changeOrderStatus} />}
        {activeTab === 'products' && <ProductsTable products={lists.products} onToggle={toggleProduct} onSaveStock={saveStock} />}
        {activeTab === 'users' && <UsersTable users={lists.users} />}
        {activeTab === 'payments' && <PaymentsTable payments={lists.payments} />}
      </div>
    </section>
  );
}

function Overview({ dashboard }) {
  const stats = dashboard.stats;
  const conversionLabel = stats.orders > 0
    ? `${Math.round((stats.paidOrders / stats.orders) * 100)}% paid`
    : 'Waiting for sales';

  return (
    <>
      <section className="admin-hero">
        <div>
          <span><Sparkles size={15} /> Maison Glow control room</span>
          <h2>Follow sales, stock, clients, and payments from one calm dashboard.</h2>
          <p>
            The data here comes from Laravel and MySQL, so every paid order and product change updates the admin view.
          </p>
        </div>
        <div className="admin-hero-card">
          <TrendingUp size={24} />
          <span>Revenue</span>
          <strong>${Number(stats.revenue).toFixed(2)}</strong>
          <small>{conversionLabel}</small>
        </div>
      </section>
      <div className="admin-stats">
        <Stat label="Revenue" value={`$${Number(stats.revenue).toFixed(2)}`} />
        <Stat label="Orders" value={stats.orders} />
        <Stat label="Paid orders" value={stats.paidOrders} />
        <Stat label="Customers" value={stats.customers} />
        <Stat label="Products" value={stats.products} />
        <Stat label="Low stock" value={stats.lowStock} />
      </div>
      <div className="admin-grid">
        <AdminPanel title="Recent orders">
          <OrdersTable orders={dashboard.recentOrders} compact />
        </AdminPanel>
        <AdminPanel title="Low stock">
          <ProductsTable products={dashboard.lowStockProducts} compact />
        </AdminPanel>
        <AdminPanel title="Top products">
          <table className="admin-table">
            <tbody>
              {dashboard.topProducts.map((product) => (
                <tr key={product.product_name}>
                  <td>{product.product_name}</td>
                  <td>{product.quantity} sold</td>
                  <td>${Number(product.revenue).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminPanel>
      </div>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div className="admin-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AdminPanel({ title, children }) {
  return (
    <div className="admin-panel">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function OrdersTable({ orders, onChangeStatus, compact = false }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Client</th>
          <th>Total</th>
          <th>Payment</th>
          {!compact && <th>Status</th>}
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.order_number}</td>
            <td>{order.user?.name || 'Guest'}</td>
            <td>${Number(order.total).toFixed(2)}</td>
            <td><span className={`admin-badge ${order.payment_status}`}>{order.payment_status}</span></td>
            {!compact && (
              <td>
                <select value={order.status} onChange={(event) => onChangeStatus(order, event.target.value)}>
                  {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ProductsTable({ products, onToggle, onSaveStock, compact = false }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          {!compact && <th>Active</th>}
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{product.category?.name}</td>
            <td>${Number(product.price).toFixed(2)}</td>
            <td>
              {compact ? product.stock : (
                <input
                  type="number"
                  defaultValue={product.stock}
                  min="0"
                  onBlur={(event) => onSaveStock(product, event.target.value)}
                />
              )}
            </td>
            {!compact && (
              <td>
                <button className="admin-toggle" onClick={() => onToggle(product)}>
                  {product.is_active ? 'Active' : 'Hidden'}
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function UsersTable({ users }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Orders</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.orders_count}</td>
            <td>{user.is_admin ? 'Admin' : 'Customer'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PaymentsTable({ payments }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Reference</th>
          <th>Order</th>
          <th>Client</th>
          <th>Amount</th>
          <th>Card</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((payment) => (
          <tr key={payment.id}>
            <td>{payment.transaction_reference}</td>
            <td>{payment.order?.order_number}</td>
            <td>{payment.order?.user?.name}</td>
            <td>${Number(payment.amount).toFixed(2)}</td>
            <td>{payment.card_brand} **** {payment.card_last_four}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
