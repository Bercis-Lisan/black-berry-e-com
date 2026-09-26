import { useNavigate } from 'react-router-dom';
import { formatRupees } from '../../utils/productDisplay';

export default function ProductCard({ product }) {
  const { id, name, description, price, image, isNew } = product;
  const descriptor = description
    ? description.split(/(?<=[.!?])\s/)[0]
    : 'Engineered with precision.';
  const navigate = useNavigate();

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`View details for ${name}`}
      onClick={() => navigate(`/product/${id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate(`/product/${id}`);
        }
      }}
      className="group flex h-full min-h-[500px] cursor-pointer flex-col rounded-[20px] border border-[#e5e5e7] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#c7c7cc] hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] sm:min-h-[520px] sm:p-6"
    >
      <div className="shrink-0">
        {/* Status Tag */}
        <div className="h-5 mb-2">
          {isNew && (
            <span className="text-[#0071e3] text-[11px] font-[600] tracking-[0.08em] uppercase">
              New
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="line-clamp-2 min-h-[48px] text-[19px] font-[600] leading-[1.24] tracking-[-0.02em] text-[#1d1d1f]">
          {name}
        </h3>

        {/* Descriptor */}
        <p className="mt-1 mb-4 line-clamp-2 min-h-[36px] text-[14px] font-[300] leading-[1.29] text-[#474747]">
          {descriptor}
        </p>
      </div>

      {/* Image Showcase */}
      <div className="my-4 flex h-[220px] w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f5f5f7]">
      <img src={image || '/placeholder-device.png'} alt={name} className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" />
      </div>

      {/* Pricing & Actions */}
      <div className="mt-auto flex min-h-[68px] items-center justify-between border-t border-[#e5e5e7] pt-4">
        <div>
          <span className="text-[12px] text-[#707070] block">From</span>
          <span className="text-[17px] font-[600] text-[#1d1d1f]">
            {formatRupees(price)}
          </span>
        </div>
        <span className="text-xs font-medium text-[#0066cc]">View product →</span>
      </div>
    </article>
  );
}