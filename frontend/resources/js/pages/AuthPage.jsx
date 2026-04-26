import { AlertCircle, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, ShoppingBag, Sparkles, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { loginAccount, registerAccount } from '../services/authApi';

export function AuthPage({ cartCount, onAuthenticated }) {
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isRegister = mode === 'register';

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setStatus(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const payload = mode === 'signin'
        ? await loginAccount(form)
        : await registerAccount(form);

      onAuthenticated(payload.user);
      setStatus({ type: 'success', text: `Welcome, ${payload.user.name}. Your account is ready.` });
    } catch (error) {
      setStatus({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <div className="auth-copy">
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80"
            alt="Maison Glow checkout editorial"
          />
          <div className="auth-copy-shade" />
          <div className="auth-copy-content">
            <span className="auth-kicker"><LockKeyhole size={16} /> Secure checkout</span>
            <h1>{isRegister ? 'Create your account' : 'Sign in to continue'}</h1>
            <p>Your panier is saved. Connect an account before payment so your order, payment status, and future history stay together.</p>
            <div className="auth-highlights">
              <span><ShoppingBag size={17} /> {cartCount} item(s) waiting</span>
              <span><ShieldCheck size={17} /> Payment protected</span>
            </div>
          </div>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <span className="auth-form-mark"><Sparkles size={16} /> Maison Glow</span>
          <div className="auth-form-heading">
            <strong>{isRegister ? 'New customer' : 'Welcome back'}</strong>
            <span>{isRegister ? 'Register once, then continue to payment.' : 'Use your email and password to unlock payment.'}</span>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Account mode">
            <button type="button" className={mode === 'signin' ? 'active' : ''} onClick={() => switchMode('signin')}>
              <Mail size={17} />
              Sign in
            </button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}>
              <UserPlus size={17} />
              Register
            </button>
          </div>

          {isRegister && (
            <label>
              Full name
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(event) => updateForm('name', event.target.value)}
                required={isRegister}
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(event) => updateForm('email', event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <span className="password-field">
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder={isRegister ? 'At least 8 characters' : 'Password'}
                value={form.password}
                onChange={(event) => updateForm('password', event.target.value)}
                minLength={8}
                required
              />
              <button
                type="button"
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                onClick={() => setPasswordVisible((visible) => !visible)}
              >
                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>

          <button className="primary-button auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Please wait...' : (isRegister ? 'Create account' : 'Sign in')}
          </button>
          <p className={`auth-note ${status?.type || ''}`}>
            {status?.type === 'success' && <CheckCircle2 size={16} />}
            {status?.type === 'error' && <AlertCircle size={16} />}
            <span>{status?.text || 'After signing in, you can continue checkout from your panier.'}</span>
          </p>
        </form>
      </div>
    </section>
  );
}
