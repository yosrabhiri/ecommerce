import React, { useState } from 'react';
import { BarChart3, Zap, Users, TrendingUp, Globe, Shield, Send } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export function PartnershipPage({ onHome }) {
  const [formData, setFormData] = useState({
    brandName: '',
    ownerName: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    productCategories: [],
    estimatedRevenue: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        productCategories: checked
          ? [...prev.productCategories, value]
          : prev.productCategories.filter(cat => cat !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/partnership`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          brandName: '',
          ownerName: '',
          email: '',
          phone: '',
          website: '',
          description: '',
          productCategories: [],
          estimatedRevenue: '',
        });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting partnership form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="static-page">
      <div className="static-hero dark">
        <img 
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80" 
          alt="Grow Together" 
          className="hero-bg"
        />
        <div className="hero-content">
          <h1>Grow Together</h1>
          <p>Join our community of premium brands and reach beauty-conscious customers worldwide.</p>
        </div>
      </div>
      
      <div className="static-content">
        <section className="about-section">
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1460925895917-aeb19be489c7?auto=format&fit=crop&w=800&q=80" alt="Analytics Dashboard" />
          </div>
          <div className="about-text">
            <h2>Why Partner With Us</h2>
            <p>
              Maison Glow is a curated marketplace dedicated to premium skincare, makeup, and wellness products. 
              We connect authentic brands with customers who value quality, sustainability, and innovation.
            </p>
            <p>
              Whether you're an emerging indie brand or an established luxury label, we provide the platform, 
              reach, and support to grow your business.
            </p>
          </div>
        </section>

        <div className="benefits-grid">
          <div className="benefit-card">
            <Globe size={32} />
            <h3>Global Reach</h3>
            <p>Access thousands of customers across continents with our international platform.</p>
          </div>
          <div className="benefit-card">
            <BarChart3 size={32} />
            <h3>Business Intelligence</h3>
            <p>Powerful analytics dashboard to track sales, inventory, and customer insights in real-time.</p>
          </div>
          <div className="benefit-card">
            <Users size={32} />
            <h3>Dedicated Support</h3>
            <p>Our partnership team provides dedicated support to ensure your success on the platform.</p>
          </div>
          <div className="benefit-card">
            <TrendingUp size={32} />
            <h3>Growth Tools</h3>
            <p>Marketing resources, promotional features, and seasonal campaigns to boost your visibility.</p>
          </div>
          <div className="benefit-card">
            <Shield size={32} />
            <h3>Trust & Security</h3>
            <p>Secure payment processing and buyer protection to build trust with your customers.</p>
          </div>
          <div className="benefit-card">
            <Zap size={32} />
            <h3>Easy Integration</h3>
            <p>Simple setup process with our APIs and tools for seamless product management.</p>
          </div>
        </div>

        <section className="partnership-process">
          <h2>How It Works</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Apply</h3>
              <p>Tell us about your brand and products. We review applications to ensure brand fit and quality standards.</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>Onboard</h3>
              <p>Our team helps you set up your storefront, upload products, and configure your business settings.</p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>Launch</h3>
              <p>Go live on the platform and start reaching customers. We provide marketing support to boost visibility.</p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <h3>Grow</h3>
              <p>Use our tools and insights to optimize your presence, increase sales, and build customer loyalty.</p>
            </div>
          </div>
        </section>

        <section className="partnership-tiers">
          <h2>Partnership Plans</h2>
          <div className="tiers-container vertical">
            <div className="tier-card">
              <h3>Emerging Brand</h3>
              <div className="price">Perfect for startups</div>
              <ul>
                <li>Up to 100 products</li>
                <li>Basic analytics dashboard</li>
                <li>Standard commission rate</li>
                <li>Community support</li>
              </ul>
              <button className="secondary-button">Learn More</button>
            </div>
            
            <div className="tier-card premium">
              <div className="badge">Popular</div>
              <h3>Premium Brand</h3>
              <div className="price">For growing businesses</div>
              <ul>
                <li>Unlimited products</li>
                <li>Advanced analytics</li>
                <li>Reduced commission rate</li>
                <li>Priority customer support</li>
                <li>Marketing features</li>
                <li>Featured placement</li>
              </ul>
              <button className="primary-button">Get Started</button>
            </div>

            <div className="tier-card">
              <h3>Luxury Collection</h3>
              <div className="price">For established brands</div>
              <ul>
                <li>Dedicated account manager</li>
                <li>Custom brand experience</li>
                <li>Negotiable terms</li>
                <li>Co-marketing campaigns</li>
                <li>Priority placement</li>
              </ul>
              <button className="secondary-button">Contact Sales</button>
            </div>
          </div>
        </section>

        <section className="partnership-faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-content">
            <div className="faq-item">
              <h4>What are the fees?</h4>
              <p>Commission rates vary by plan and product category, typically ranging from 15-25%. We charge no setup fees or monthly subscriptions.</p>
            </div>
            <div className="faq-item">
              <h4>How long does onboarding take?</h4>
              <p>Most brands are live within 5-7 business days after approval. Our team works quickly to get you set up and ready to sell.</p>
            </div>
            <div className="faq-item">
              <h4>Do you handle customer service?</h4>
              <p>We handle order processing and returns, while you manage product support. We provide tools to help you respond to customer inquiries.</p>
            </div>
            <div className="faq-item">
              <h4>Can I use your APIs?</h4>
              <p>Yes! Premium partners get access to our REST API for inventory sync, order management, and more.</p>
            </div>
          </div>
        </section>

        <section className="partnership-form-section">
          <div className="form-container">
            <h2>Apply for Partnership</h2>
            <p>Complete this form to start your journey with Maison Glow</p>

            {submitted && (
              <div className="success-message">
                <h3>Application submitted successfully.</h3>
                <p>Our team will review your application and contact you within 24 hours.</p>
              </div>
            )}

            <form className="partnership-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="brandName">Brand Name *</label>
                  <input
                    type="text"
                    id="brandName"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your brand name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ownerName">Owner/Contact Name *</label>
                  <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="contact@brand.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourbrand.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Brand Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Tell us about your brand, products, and mission"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Product Categories *</label>
                <div className="checkbox-group">
                  {['Skincare', 'Makeup', 'Haircare', 'Supplements', 'Tools', 'Other'].map(cat => (
                    <label key={cat} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="productCategories"
                        value={cat}
                        checked={formData.productCategories.includes(cat)}
                        onChange={handleChange}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="estimatedRevenue">Estimated Annual Revenue *</label>
                <select
                  id="estimatedRevenue"
                  name="estimatedRevenue"
                  value={formData.estimatedRevenue}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a range</option>
                  <option value="0-50k">Under $50,000</option>
                  <option value="50k-250k">$50,000 - $250,000</option>
                  <option value="250k-1m">$250,000 - $1,000,000</option>
                  <option value="1m+">$1,000,000+</option>
                </select>
              </div>

              <button type="submit" className="primary-button form-submit" disabled={loading}>
                <Send size={16} /> {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </section>

        <div className="about-cta">
          <h2>Ready to Grow?</h2>
          <p>Join hundreds of successful brands on Maison Glow</p>
          <button className="primary-button large" onClick={onHome}>Back to Shop</button>
        </div>
      </div>
    </div>
  );
}
