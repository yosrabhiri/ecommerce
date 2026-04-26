import { PackageCheck, Recycle, ShieldCheck } from 'lucide-react';

export function ProductBenefits() {
  return (
    <>
      <div className="stock-row">
        <span>In stock and ready to ship</span>
        <span>Free shipping over $50</span>
      </div>

      <div className="benefit-strip">
        <div>
          <Recycle size={22} />
          <strong>Clean materials</strong>
          <span>Thoughtful fabrics and formulas</span>
        </div>
        <div>
          <ShieldCheck size={22} />
          <strong>Quality checked</strong>
          <span>Selected for everyday use</span>
        </div>
        <div>
          <PackageCheck size={22} />
          <strong>Plastic-light packaging</strong>
          <span>Less waste, nicer delivery</span>
        </div>
      </div>
    </>
  );
}
