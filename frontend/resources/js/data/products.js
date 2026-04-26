export const categories = ['All', 'Skincare', 'Dresses', 'Knitwear', 'Sets', 'Accessories'];

const productNames = {
  Skincare: [
    'Barrier Silk Hydrating Serum',
    'Cloud Cleanser with Oat Milk',
    'Peptide Night Cream',
    'Vitamin Dew Body Oil',
    'Mineral SPF Glow Drops',
    'Rose Water Gel Toner',
    'Ceramide Repair Balm',
    'Aloe Sleep Mask',
    'Soft Foam Daily Wash',
    'Bright C Renewal Cream',
  ],
  Dresses: [
    'Soft Tailored Linen Dress',
    'Satin Evening Slip Dress',
    'Cotton Poplin Midi Dress',
    'Ribbed Column Dress',
    'Silk Blend Wrap Dress',
    'Everyday Shirt Dress',
    'Pleated Garden Dress',
    'Minimal Knit Dress',
    'Square Neck Day Dress',
    'Fluid Maxi Dress',
  ],
  Knitwear: [
    'Alpaca Blend Cardigan',
    'Organic Cotton Wrap Top',
    'Fine Rib Long Sleeve',
    'Merino Soft Crewneck',
    'Relaxed Knit Polo',
    'Cashmere Touch Hoodie',
    'Textured Button Vest',
    'Lightweight Turtleneck',
    'Pointelle Knit Tee',
    'Soft Lounge Sweater',
  ],
  Sets: [
    'Ribbed Cream Lounge Set',
    'Weekend Knit Co-Ord',
    'Soft Jersey Travel Set',
    'Linen Shirt and Short Set',
    'Clean Cotton Sleep Set',
    'Studio Rib Two Piece',
    'Brushed Fleece Set',
    'Satin Cami Set',
    'Minimal Modal Set',
    'Everyday Layering Set',
  ],
  Accessories: [
    'Rose Quartz Facial Roller',
    'Pearl Mini Shoulder Bag',
    'Silk Cloud Scrunchie Set',
    'Canvas Beauty Pouch',
    'Ribbed Wool Scarf',
    'Gold Hoop Duo',
    'Soft Travel Organizer',
    'Cotton Makeup Rounds',
    'Minimal Hair Claw',
    'Satin Sleep Eye Mask',
  ],
};

const brands = ['Noura Skin', 'Atelier Lumi', 'Maison Glow', 'Sora Studio', 'Velvet Leaf', 'Aster Lane'];

const imagePools = {
  Skincare: [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=900&q=80',
  ],
  Dresses: [
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
  ],
  Knitwear: [
    'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
  ],
  Sets: [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80',
  ],
  Accessories: [
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80',
  ],
};

const productCategories = ['Skincare', 'Dresses', 'Knitwear', 'Sets', 'Accessories'];

export const products = Array.from({ length: 100 }, (_, index) => {
  const id = index + 1;
  const category = productCategories[index % productCategories.length];
  const names = productNames[category];
  const pool = imagePools[category];
  const image = pool[index % pool.length];
  const price = 18 + ((index * 7) % 135);
  const hasSale = index % 7 === 0;

  return {
    id,
    brand: brands[index % brands.length],
    name: names[index % names.length],
    category,
    price,
    oldPrice: hasSale ? price + 18 : null,
    rating: Number((4.3 + ((index % 7) * 0.1)).toFixed(1)),
    tag: hasSale ? 'Sale' : (index % 9 === 0 ? 'New' : null),
    image,
    images: Array.from({ length: Math.min(4, pool.length) }, (_, imageIndex) => pool[(index + imageIndex) % pool.length]),
    description: `A ${category.toLowerCase()} essential from ${brands[index % brands.length]}, curated for the Maison Glow ecommerce collection.`,
  };
});
