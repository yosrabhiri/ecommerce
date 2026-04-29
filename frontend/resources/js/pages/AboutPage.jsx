import React from 'react';

export function AboutPage({ onHome }) {
  return (
    <div className="static-page">
      <div className="static-hero">
        <img 
          src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1600&q=80" 
          alt="Maison Glow Philosophy" 
          className="hero-bg"
        />
        <div className="hero-content">
          <h1>Our Philosophy</h1>
          <p>Clean ingredients, mindful rituals, and radiant skin.</p>
        </div>
      </div>
      
      <div className="static-content">
        <section className="about-section">
          <div className="about-text">
            <h2>Rooted in Nature</h2>
            <p>
              At Maison Glow, we believe that true beauty begins with respect for the earth and ourselves. 
              Our formulas are crafted using ethically sourced, botanical ingredients that work in harmony 
              with your skin's natural balance.
            </p>
            <p>
              We say no to harsh chemicals, artificial fragrances, and unnecessary fillers. 
              Every bottle is a testament to our commitment to purity and efficacy.
            </p>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80" alt="Botanical Ingredients" />
          </div>
        </section>

        <section className="about-section reverse">
          <div className="about-text">
            <h2>The Art of the Ritual</h2>
            <p>
              Skincare is more than a routine; it's a moment of connection. We design our products to engage 
              the senses—from the soft glide of a serum to the calming scent of natural oils.
            </p>
            <p>
              Take a breath, slow down, and transform your daily care into a mindful ritual.
            </p>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80" alt="Mindful Skincare" />
          </div>
        </section>

        <section className="about-section">
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80" alt="Sustainability" />
          </div>
          <div className="about-text">
            <h2>Committed to Sustainability</h2>
            <p>
              Our packaging is 100% recyclable and made from sustainable materials. 
              We partner with suppliers who share our values and commitment to the environment.
            </p>
            <p>
              By choosing Maison Glow, you're supporting a brand that cares as much about 
              the planet as you do.
            </p>
          </div>
        </section>

        <div className="about-cta">
          <button className="primary-button" onClick={onHome}>Discover the Collection</button>
        </div>
      </div>
    </div>
  );
}
