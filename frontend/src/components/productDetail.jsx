import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { getProduct } from '../data/products';
import { useCart } from '../context/CartContext';
import { ensureProductColors, formatRupees } from '../utils/productDisplay';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const catalogProduct = getProduct(id);
  const [databaseProduct, setDatabaseProduct] = useState(null);
  const [loading, setLoading] = useState(!catalogProduct);

  useEffect(() => {
    if (catalogProduct) {
      setDatabaseProduct(null);
      setLoading(false);
      return undefined;
    }

    let active = true;
    setLoading(true);
    axios.get(`${API_BASE_URL}/products`)
      .then(({ data }) => {
        if (active) {
          const found = (data.products || []).find((item) => item._id === id);
          setDatabaseProduct(found ? { ...found, id: found._id } : null);
        }
      })
      .catch((error) => {
        console.error('Could not load product details:', error);
        if (active) setDatabaseProduct(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, catalogProduct]);

  const product = catalogProduct || databaseProduct;
  const variantOptions = product?.variants?.length ? product.variants : ['Standard'];
  const availableColors = useMemo(
  () => ensureProductColors(product?.colors),
  [product]
);
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
  setSelectedColor(availableColors[0]);
}, [id, product, availableColors]);

  const handleAdd = () => {
    if (!product) return;
    const addedToCart = addToCart({
      ...product,
      id: product.id || product._id,
      color: selectedColor,
      variants: [selectedStorage || variantOptions[0]],
    });
    if (!addedToCart) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center bg-[#f5f5f7] text-sm text-[#707070]">Loading product…</div>;
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#f5f5f7] px-6 text-center">
        <h1 className="text-2xl font-semibold text-[#1d1d1f]">Product not found</h1>
        <Link to="/products" className="text-[#0066cc] hover:underline">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f5f5f7] min-h-screen">
      <div className="w-full bg-white border-b border-[#d2d2d7] sticky top-[33px] z-40 py-3">
        <div className="max-w-[1440px] mx-auto px-[24px] flex items-center justify-between">
          <h2 className="text-[21px] font-[600] text-[#1d1d1f]">{product.name}</h2>
          <div className="flex items-center space-x-4"><span className="text-[14px] text-[#474747]">From {formatRupees(product.price)}</span><button type="button" onClick={handleAdd} className={`text-[14px] font-[400] rounded-[980px] px-[15px] py-[6px] transition-colors ${added ? 'bg-[#1d7a3d] text-white' : 'bg-[#0071e3] text-[#f4f8fb] hover:opacity-90'}`}>{added ? 'Buy ✓' : 'Buy'}</button></div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-[24px] py-[56px] grid grid-cols-1 lg:grid-cols-2 gap-[48px] items-start">
        <div className="w-full bg-white rounded-[8px] p-[40px] border border-[#d2d2d7] flex items-center justify-center">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full max-h-[450px] object-contain" />
          ) : (
            <div className="w-full h-[400px] flex items-center justify-center text-[#858585] text-[14px]">No image available</div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-[#2997ff] text-[14px] font-[600]">In Stock</span>
          <h1 className="text-[40px] font-[600] text-[#1d1d1f] leading-[1.14] mt-1 mb-2">Buy {product.name}</h1>
          <p className="text-[21px] font-[300] text-[#474747] mb-6">{formatRupees(product.price)}</p>
          <p className="text-[17px] font-[400] text-[#1d1d1f] leading-[1.47] mb-8 pb-6 border-b border-[#d2d2d7]">{product.description}</p>

          <section className="mb-8 border-b border-[#d2d2d7] pb-6">
            <h3 className="mb-3 text-sm font-semibold text-[#1d1d1f]">Choose a color</h3>
            <div className="flex items-center gap-3">
              {availableColors.map((color, index) => (
                <button
                  key={`${color}-${index}`}
                  type="button"
                  aria-label={`Select color ${color}`}
                  aria-pressed={selectedColor === color}
                  title={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-9 w-9 rounded-full border border-black/15 transition ${selectedColor === color ? 'ring-2 ring-[#0071e3] ring-offset-2' : 'hover:scale-105'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </section>

          {product.specs && product.specs.length > 0 && (
            <div className="mb-8 pb-6 border-b border-[#d2d2d7]">
              <h3 className="text-[14px] font-[600] text-[#1d1d1f] mb-3">Tech Specs</h3>
              <dl className="divide-y divide-[#f5f5f7]">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between py-2 text-[14px]">
                    <dt className="text-[#707070]">{spec.label}</dt>
                    <dd className="text-[#1d1d1f] font-[600] text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mb-8"><label className="text-[14px] font-[600] text-[#1d1d1f] block mb-3">Storage / Configuration</label><div className="grid grid-cols-2 gap-3">{variantOptions.map((capacity) => <button key={capacity} onClick={() => setSelectedStorage(capacity)} className={`p-4 rounded-[8px] border text-left flex justify-between items-center transition-all ${selectedStorage === capacity ? 'border-[#0071e3] bg-[#f4f8fb]' : 'border-[#d2d2d7] bg-white hover:border-[#858585]'}`}><span className="text-[17px] font-[600] text-[#1d1d1f]">{capacity}</span><span className="text-[12px] text-[#707070]">Standard</span></button>)}</div></div>
          <div className="space-y-3"><button type="button" onClick={handleAdd} className={`w-full text-white text-[17px] font-[400] rounded-[980px] py-[11px] transition-colors ${added ? 'bg-[#1d7a3d]' : 'bg-[#0071e3] hover:opacity-90'}`}>{added ? 'Added to Bag ✓' : `Add to Bag - ${formatRupees(product.price)}`}</button><Link to="/products" className="block text-center text-[#0066cc] text-[14px] hover:underline">Continue Shopping</Link></div>
        </div>
      </div>
    </div>
  );
}
