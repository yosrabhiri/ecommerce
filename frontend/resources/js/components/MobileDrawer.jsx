import { X } from 'lucide-react';

export function MobileDrawer({ onClose }) {
  return (
    <div className="mobile-drawer">
      <button className="icon-button" onClick={onClose} aria-label="Close menu">
        <X size={22} />
      </button>
      <a href="#">New In</a>
      <a href="#">Clothing</a>
      <a href="#">Skincare</a>
      <a href="#">Accessories</a>
      <a href="#">Membership</a>
    </div>
  );
}
