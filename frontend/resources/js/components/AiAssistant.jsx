import { Bot, Send, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const starterMessages = [
  {
    role: 'assistant',
    text: 'Bonjour, je suis Maison AI. Je peux te guider vers un produit, expliquer le checkout ou proposer une routine simple.',
  },
];

const quickPrompts = [
  'Recommend something popular',
  'Help me choose skincare',
  'How does payment work?',
];

export function AiAssistant({ products = [], cart = [], favorites = [] }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState('');

  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);

  const sendMessage = (value = input) => {
    const text = value.trim();

    if (!text) {
      return;
    }

    const reply = buildAssistantReply(text, {
      products: featuredProducts,
      cart,
      favorites,
    });

    setMessages((currentMessages) => [
      ...currentMessages,
      { role: 'user', text },
      { role: 'assistant', text: reply },
    ]);
    setInput('');
    setOpen(true);
  };

  return (
    <div className={`ai-assistant ${open ? 'open' : ''}`}>
      {open && (
        <section className="ai-panel" aria-label="Maison AI assistant">
          <div className="ai-panel-header">
            <div>
              <span><Sparkles size={14} /> Maison AI</span>
              <strong>Shopping assistant</strong>
            </div>
            <button className="icon-button" onClick={() => setOpen(false)} aria-label="Close assistant">
              <X size={18} />
            </button>
          </div>

          <div className="ai-messages">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`ai-message ${message.role}`}>
                {message.text}
              </div>
            ))}
          </div>

          <div className="ai-quick-prompts" aria-label="Suggested assistant prompts">
            {quickPrompts.map((prompt) => (
              <button key={prompt} onClick={() => sendMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="ai-input-row"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask for product help..."
              aria-label="Ask Maison AI"
            />
            <button type="submit" aria-label="Send message">
              <Send size={17} />
            </button>
          </form>
        </section>
      )}

      <button className="ai-fab" onClick={() => setOpen((isOpen) => !isOpen)} aria-label="Open Maison AI assistant">
        <Bot size={22} />
        <span>AI</span>
      </button>
    </div>
  );
}

function buildAssistantReply(message, { products, cart, favorites }) {
  const text = message.toLowerCase();
  const firstProduct = products[0];
  const secondProduct = products[1];

  if (text.includes('payment') || text.includes('pay') || text.includes('checkout')) {
    return 'The checkout creates a pending order first, then sends you to payment. For the real payment version, this can be connected to Stripe or PayPal with secure webhooks.';
  }

  if (text.includes('skin') || text.includes('routine')) {
    const productName = firstProduct?.name || 'a gentle skincare item';
    return `For skincare, I would start with ${productName}. Keep the routine simple: cleanse, hydrate, then add one targeted treatment based on your concern.`;
  }

  if (text.includes('cart')) {
    return cart.length
      ? `You currently have ${cart.length} item type(s) in your cart. I can help you complete the look before checkout.`
      : 'Your cart is empty for now. Try opening a product page and adding one item, then I can suggest a matching product.';
  }

  if (text.includes('favorite') || text.includes('wishlist')) {
    return favorites.length
      ? `You have ${favorites.length} favorite item(s). A nice next step is comparing them by price, category, and occasion.`
      : 'Your wishlist is empty. Tap the heart on products you like, then Maison AI can help you compare them.';
  }

  if (text.includes('recommend') || text.includes('popular') || text.includes('choose')) {
    if (firstProduct && secondProduct) {
      return `I would compare ${firstProduct.name} with ${secondProduct.name}. Pick the first for a safer everyday choice, or the second if you want something more expressive.`;
    }

    return 'I can recommend products once the catalog is loaded from the backend.';
  }

  return 'I am a demo assistant for now, so my answers are simulated. I can still help with product discovery, checkout explanation, wishlist ideas, and the future real payment flow.';
}
