import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  ArrowUpRight,
  Box,
  CircleDollarSign,
  ImagePlus,
  LogOut,
  Package,
  RefreshCw,
  ShoppingBag,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatRupees } from '../utils/productDisplay';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;
const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
const emptyForm = {
  name: '',
  category: 'mobiles',
  price: '',
  originalPrice: '',
  tag: '',
  rating: '',
  reviews: '',
  colors: '',
  variants: '',
  specs: '',
  image: '',
  description: '',
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInput = useRef(null);
  const [stats, setStats] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [loadError, setLoadError] = useState('');

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    setLoadError('');
    try {
      const { data } = await axios.get(`${API_BASE_URL}/admin/stats`);
      setStats(data.stats);
      setRecentOrders(data.recentOrders || []);
      setSalesTrend(data.salesTrend || []);
      setTopProducts(data.topProducts || []);
    } catch (err) {
      console.error('Could not load admin analytics:', err);
      setLoadError(err.response?.data?.message || 'Analytics could not be loaded. Please refresh to try again.');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/products`);
      setProducts(data.products || []);
    } catch (err) {
      console.error('Could not load admin products:', err);
      setLoadError((current) => current || 'Products could not be loaded. Please refresh to try again.');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadProducts();
  }, [loadStats, loadProducts]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage({ type: 'error', text: 'Choose a JPEG, PNG, or WebP image.' });
      event.target.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setMessage({ type: 'error', text: 'Images must be 3 MB or smaller.' });
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setMessage({ type: 'error', text: 'The selected image could not be read.' });
        return;
      }
      setForm((current) => ({ ...current, image: reader.result }));
      setMessage(null);
    };
    reader.onerror = () => setMessage({ type: 'error', text: 'The selected image could not be read.' });
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const colors = form.colors.split(',').map((color) => color.trim()).filter(Boolean);
      if (new Set(colors).size < 3) {
        setMessage({ type: 'error', text: 'Add at least 3 distinct colors, separated by commas.' });
        return;
      }

      const specLines = form.specs.split('\n').filter((line) => line.trim());
      const specs = specLines.map((line) => {
        const separator = line.indexOf(':');
        if (separator < 1) return null;
        const label = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim();
        return label && value ? { label, value } : null;
      });
      if (specs.some((spec) => !spec)) {
        setMessage({ type: 'error', text: 'Enter specs one per line in “Name: Value” format.' });
        return;
      }

      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        rating: form.rating ? Number(form.rating) : 0,
        reviews: form.reviews ? Number(form.reviews) : 0,
        colors,
        variants: form.variants ? form.variants.split(',').map((variant) => variant.trim()).filter(Boolean) : [],
        specs,
      };
      await axios.post(`${API_BASE_URL}/products`, payload);
      setMessage({ type: 'success', text: 'Product added and published successfully.' });
      setForm(emptyForm);
      if (fileInput.current) fileInput.current.value = '';
      await loadProducts();
    } catch (err) {
      console.error('Could not add product:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Could not add product. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      await loadProducts();
      setMessage({ type: 'success', text: 'Product deleted.' });
    } catch (err) {
      console.error('Could not delete product:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not delete product.' });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.alert('Logout successful.');
      navigate('/login');
    } catch (err) {
      console.error('Could not sign out:', err);
      setMessage({ type: 'error', text: 'Could not sign out. Please try again.' });
    }
  };

  return (
    <main className="min-h-screen bg-[#08090b] px-4 py-6 text-[#f5f5f7] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px] space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1479f6]/15 text-[#60a5fa]">
              <Box size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#60a5fa]">Black Berry</p>
              <h1 className="mt-0.5 text-2xl font-semibold tracking-tight sm:text-3xl">Store overview</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-[#86868b]">Administrator</p>
            </div>
            <button
              type="button"
              onClick={loadStats}
              disabled={loadingStats}
              aria-label="Refresh dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-[#c8c8cc] transition hover:bg-white/5 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loadingStats ? 'animate-spin' : ''} />
            </button>
            <Link to="/" className="hidden rounded-xl border border-white/10 px-4 py-2.5 text-sm text-[#c8c8cc] transition hover:bg-white/5 sm:block">
              View store
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-sm text-[#c8c8cc] transition hover:bg-white/10"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        {loadError && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            <span>{loadError}</span>
            <button type="button" onClick={() => { loadStats(); loadProducts(); }} className="font-semibold underline underline-offset-4">
              Retry
            </button>
          </div>
        )}

        <section aria-labelledby="metrics-heading">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#86868b]">Performance</p>
              <h2 id="metrics-heading" className="mt-1 text-lg font-semibold">Store metrics</h2>
            </div>
            <p className="text-xs text-[#86868b]">All-time totals · Recent activity</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total revenue" value={formatCurrency(stats?.totalSales)} note="From paid orders" icon={CircleDollarSign} tone="blue" loading={loadingStats} />
            <MetricCard label="Paid orders" value={stats?.totalOrders ?? 0} note={`${formatCurrency(stats?.averageOrderValue)} average order`} icon={ShoppingBag} tone="violet" loading={loadingStats} />
            <MetricCard label="Customers" value={stats?.totalUsers ?? 0} note={`${stats?.newUsersLast7Days ?? 0} joined in the last 7 days`} icon={Users} tone="green" loading={loadingStats} />
            <MetricCard label="Products" value={stats?.productCount ?? products.length} note="Published in your product catalog" icon={Package} tone="amber" loading={loadingStats} />
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.65fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-[#121316] p-5 sm:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">Revenue trend</h2>
                <p className="mt-1 text-xs text-[#86868b]">Daily paid sales over the last 7 days</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-[#1479f6]/10 px-3 py-1.5 text-xs font-medium text-[#60a5fa]">
                <TrendingUp size={14} /> Last 7 days
              </span>
            </div>
            {loadingStats ? (
              <div className="h-[230px] animate-pulse rounded-xl bg-white/[0.03]" />
            ) : (
              <SalesChart data={salesTrend} />
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#121316] p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Top products</h2>
                <p className="mt-1 text-xs text-[#86868b]">Best sellers by units sold</p>
              </div>
              <ArrowUpRight size={17} className="text-[#86868b]" />
            </div>
            {loadingStats ? (
              <div className="space-y-5">{[1, 2, 3, 4].map((item) => <div key={item} className="h-10 animate-pulse rounded-lg bg-white/[0.03]" />)}</div>
            ) : topProducts.length ? (
              <div className="space-y-5">
                {topProducts.map((product, index) => {
                  const maxUnits = Math.max(...topProducts.map((entry) => entry.unitsSold), 1);
                  return (
                    <div key={product._id || product.name}>
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                        <span className="truncate text-[#dedee2]"><span className="mr-2 text-xs text-[#777980]">0{index + 1}</span>{product._id || 'Unnamed product'}</span>
                        <span className="shrink-0 text-xs text-[#86868b]">{product.unitsSold} sold</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#1479f6] to-[#72b7ff]" style={{ width: `${Math.max(5, (product.unitsSold / maxUnits) * 100)}%` }} />
                      </div>
                      <p className="mt-1.5 text-right text-xs text-[#86868b]">{formatCurrency(product.revenue)} revenue</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState icon={TrendingUp} text="Sales of individual products will appear here." />
            )}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#121316]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-semibold">Recent orders</h2>
                <p className="mt-1 text-xs text-[#86868b]">Latest completed payments</p>
              </div>
              <ShoppingBag size={18} className="text-[#86868b]" />
            </div>
            {loadingStats ? (
              <div className="space-y-3 p-5">{[1, 2, 3].map((item) => <div key={item} className="h-12 animate-pulse rounded-lg bg-white/[0.03]" />)}</div>
            ) : recentOrders.length ? (
              <div className="divide-y divide-white/[0.06]">
                {recentOrders.slice(0, 6).map((order) => (
                  <div key={order._id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{order.userEmail || 'Guest checkout'}</p>
                      <p className="mt-1 text-xs text-[#86868b]">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Date unavailable'}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold">{formatCurrency(order.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={ShoppingBag} text="Paid orders will appear here when customers check out." />
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#121316] p-5 sm:p-6">
            <div className="mb-5">
              <h2 className="font-semibold">Add a product</h2>
              <p className="mt-1 text-xs text-[#86868b]">Add details and publish an image to your store.</p>
            </div>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input label="Product name" name="name" value={form.name} onChange={handleChange} required />
              <div>
                <label htmlFor="category" className="mb-1.5 inline-block text-xs font-medium text-[#b5b5bb]">Category</label>
                <select id="category" name="category" value={form.category} onChange={handleChange} className="admin-input">
                  <option value="mobiles">Mobiles</option>
                  <option value="tv-monitors">TV &amp; Monitors</option>
                  <option value="appliances">Appliances</option>
                  <option value="computers">Computers</option>
                  <option value="wearables">Wearables &amp; Accessories</option>
                </select>
              </div>
              <Input label="Price (₹)" name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={handleChange} required />
              <Input label="Original price (₹)" name="originalPrice" type="number" min="0" step="0.01" value={form.originalPrice} onChange={handleChange} />
              <Input label="Tag" name="tag" value={form.tag} onChange={handleChange} placeholder="New, Sale" />
              <Input label="Rating (0-5)" name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} />
              <Input label="Reviews" name="reviews" type="number" min="0" value={form.reviews} onChange={handleChange} />
              <Input label="Colors (minimum 3)" name="colors" value={form.colors} onChange={handleChange} placeholder="#1D1D1F, #E3D9C6, #3A5DFF" required />
              <Input label="Variants" name="variants" value={form.variants} onChange={handleChange} placeholder="128GB, 256GB" />
              <div className="sm:col-span-2">
                <label htmlFor="specs" className="mb-1.5 inline-block text-xs font-medium text-[#b5b5bb]">Product specifications</label>
                <textarea
                  id="specs"
                  name="specs"
                  value={form.specs}
                  onChange={handleChange}
                  rows={5}
                  placeholder={'Display: 6.7” OLED, 120Hz\nChip: B18 Pro\nBattery: Up to 29 hours'}
                  className="admin-input resize-y"
                />
                <p className="mt-1 text-xs text-[#777980]">Enter one specification per line as “Name: Value”.</p>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="product-image" className="mb-1.5 inline-block text-xs font-medium text-[#b5b5bb]">Product image</label>
                <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-white/15 bg-black/20 p-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className="flex min-h-24 flex-1 items-center justify-center gap-3 rounded-xl bg-white/[0.03] px-4 text-sm text-[#c8c8cc] transition hover:bg-white/[0.06]"
                  >
                    {form.image ? (
                      <img src={form.image} alt="Product preview" className="h-20 w-20 rounded-lg bg-white object-contain" />
                    ) : (
                      <ImagePlus size={22} className="text-[#60a5fa]" />
                    )}
                    <span className="text-left">
                      <span className="block font-medium">{form.image ? 'Image selected' : 'Choose an image'}</span>
                      <span className="mt-1 block text-xs text-[#777980]">JPEG, PNG or WebP · up to 3 MB</span>
                    </span>
                  </button>
                  <input ref={fileInput} id="product-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="sr-only" />
                  <span className="text-center text-xs text-[#777980]">or</span>
                  <input
                    type="url"
                    name="image"
                    value={form.image.startsWith('data:image/') ? '' : form.image}
                    onChange={handleChange}
                    placeholder="Paste an image URL"
                    aria-label="Image URL"
                    className="admin-input sm:max-w-[190px]"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="description" className="mb-1.5 inline-block text-xs font-medium text-[#b5b5bb]">Description</label>
                <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} className="admin-input resize-y" />
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
                <button type="submit" disabled={submitting || !form.image} className="rounded-xl bg-[#1479f6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0869df] disabled:cursor-not-allowed disabled:opacity-50">
                  {submitting ? 'Publishing…' : 'Publish product'}
                </button>
                {message && <p role="status" className={`text-sm ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{message.text}</p>}
              </div>
            </form>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#121316] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Product catalog</h2>
              <p className="mt-1 text-xs text-[#86868b]">Products published to your storefront</p>
            </div>
            <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-[#c8c8cc]">{products.length} total</span>
          </div>
          {loadingProducts ? (
            <p className="py-6 text-center text-sm text-[#86868b]">Loading products…</p>
          ) : products.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div key={product._id} className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-3">
                  <img src={product.image} alt={product.name} className="h-16 w-16 shrink-0 rounded-xl bg-white object-contain p-1" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="mt-1 truncate text-xs text-[#86868b]">{product.category} · {formatRupees(product.price)}</p>
                  </div>
                  <button type="button" onClick={() => handleDeleteProduct(product._id)} aria-label={`Delete ${product.name}`} className="rounded-lg p-2 text-[#86868b] transition hover:bg-red-400/10 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Package} text="No database products yet. Add one above to publish it." />
          )}
        </section>
        </div>
        <style>{`
        .admin-input {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          background: rgba(0, 0, 0, 0.25);
          padding: 0.65rem 0.8rem;
          color: #f5f5f7;
          font-size: 0.8125rem;
          outline: none;
        }
        .admin-input:focus { border-color: #1479f6; }
        .admin-input::placeholder { color: #686a72; }
        .admin-input option { background: #121316; }
        `}</style>
    </main>
  );
}

function MetricCard({ label, value, note, icon: Icon, tone, loading }) {
  const tones = {
    blue: 'bg-blue-400/10 text-blue-300',
    violet: 'bg-violet-400/10 text-violet-300',
    green: 'bg-emerald-400/10 text-emerald-300',
    amber: 'bg-amber-400/10 text-amber-300',
  };
  return (
    <div className="rounded-3xl border border-white/10 bg-[#121316] p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-[#a1a1a8]">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}><Icon size={17} /></span>
      </div>
      {loading ? (
        <div className="mt-4 h-8 w-28 animate-pulse rounded bg-white/[0.06]" />
      ) : (
        <p className="mt-3 text-2xl font-semibold tracking-tight">{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
      )}
      <p className="mt-2 text-xs text-[#777980]">{note}</p>
    </div>
  );
}

function SalesChart({ data }) {
  if (!data.length) return <EmptyState icon={CircleDollarSign} text="Sales activity will appear here once orders are paid." />;
  const chartHeight = 180;
  const maxSales = Math.max(...data.map((item) => item.sales), 1);
  const barWidth = 28;
  const gap = 48;
  const width = data.length * (barWidth + gap);
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} 226`} role="img" aria-label="Daily revenue chart for the last seven days" className="h-[230px] min-w-[480px] w-full">
        {[0, 1, 2, 3].map((line) => {
          const y = 12 + (chartHeight / 3) * line;
          return <line key={line} x1="0" x2={width} y1={y} y2={y} stroke="rgba(255,255,255,0.07)" strokeDasharray="4 6" />;
        })}
        {data.map((item, index) => {
          const x = index * (barWidth + gap) + gap / 2;
          const barHeight = item.sales ? Math.max(4, (item.sales / maxSales) * (chartHeight - 10)) : 3;
          const y = chartHeight - barHeight + 12;
          const weekday = new Date(`${item.date}T00:00:00Z`).toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'UTC' });
          return (
            <g key={item.date}>
              <title>{`${weekday}: ${formatCurrency(item.sales)} · ${item.orders} orders`}</title>
              <rect x={x} y={y} width={barWidth} height={barHeight} rx="8" fill={item.sales ? '#2487ff' : 'rgba(255,255,255,0.08)'} />
              <text x={x + barWidth / 2} y="215" textAnchor="middle" fill="#85868d" fontSize="11">{weekday}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center gap-3 text-center text-sm text-[#777980]">
      <Icon size={21} className="text-[#5d6068]" />
      <p>{text}</p>
    </div>
  );
}

function Input({ label, ...props }) {
  const id = `product-${props.name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 inline-block text-xs font-medium text-[#b5b5bb]">{label}</label>
      <input {...props} id={id} className="admin-input" />
    </div>
  );
}
