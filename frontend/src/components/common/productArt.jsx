import { getCategory } from "../../data/products";

function ProductArt({ category, className = "" }) {
  const cat = getCategory(category);
  if (!cat) return <div className={`bg-mist ${className}`} />;
  const Icon = cat.icon;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${cat.gradient} ${className}`}
    >
      <div className="absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -left-8 -bottom-10 h-28 w-28 rounded-full bg-black/10 blur-2xl" />
      <Icon className="relative h-1/3 w-1/3 text-white/90" strokeWidth={1.25} />
    </div>
  );
}

export default ProductArt;
