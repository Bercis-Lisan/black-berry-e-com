import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, UserRound, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ADMIN_UID } from '../adminRoute';

export default function Nav() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen && !accountOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setAccountOpen(false);
      }
    };
    const closeAccountOnOutsideClick = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    const previousOverflow = document.body.style.overflow;
    if (menuOpen) document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeAccountOnOutsideClick);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeAccountOnOutsideClick);
    };
  }, [menuOpen, accountOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      setAccountOpen(false);
      window.alert('Logout successful.');
      navigate('/');
    } catch (err) {
      console.error('Could not sign out:', err);
      window.alert('Could not sign out. Please try again.');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#333333] bg-[#1d1d1f]/95 py-[8px] backdrop-blur-md">
        <div ref={accountMenuRef} className="relative max-w-[1440px] mx-auto px-[24px] flex items-center justify-between text-[12px] font-[400] text-[#f5f5f7] tracking-[-0.022em]">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="font-semibold text-[14px]">Black Berry</span>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex flex-1 items-center justify-center space-x-6">
          <Link to="/" className="text-[#f5f5f7] hover:text-white transition-colors">Store</Link>
          <Link to="/products" className="text-[#f5f5f7] hover:text-white transition-colors">All Products</Link>
          <Link to="/products/computers" className="text-[#f5f5f7] hover:text-white transition-colors">Mac</Link>
          <Link to="/products/mobiles" className="text-[#f5f5f7] hover:text-white transition-colors">Black Berry</Link>
          <Link to="/products/wearables" className="text-[#f5f5f7] hover:text-white transition-colors">Wearables</Link>
        </nav>

        {/* Utilities & User State */}
        <div className="hidden items-center space-x-4 md:flex">
          <Link to="/cart" className="relative text-[#f5f5f7] hover:text-white transition-colors flex items-center">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
              <path d="M14 5h-2a4 4 0 0 0-8 0H2a1 1 0 0 0-1 1v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a1 1 0 0 0-1-1zM8 2a3 3 0 0 1 3 3H5a3 3 0 0 1 3-3zm5 12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6h2v1a1 1 0 0 0 2 0V6h4v1a1 1 0 0 0 2 0V6h2v8z"/>
            </svg>
            {cartCount > 0 && (
              <span className="ml-1 bg-[#0071e3] text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                aria-label="Open account menu"
                aria-expanded={accountOpen}
                aria-controls="account-dropdown"
                onClick={() => setAccountOpen((open) => !open)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[#f5f5f7] transition hover:border-white/30 hover:bg-white/10"
              >
                <UserRound size={17} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-[#f5f5f7] hover:text-white transition-colors text-[12px]">
              Sign In
            </Link>
          )}
        </div>

        <div className="flex items-center gap-5 md:hidden">
          <Link
            to="/cart"
            aria-label={`Shopping bag${cartCount ? `, ${cartCount} items` : ''}`}
            className="relative flex items-center text-[#f5f5f7] hover:text-white"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M14 5h-2a4 4 0 0 0-8 0H2a1 1 0 0 0-1 1v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a1 1 0 0 0-1-1zM8 2a3 3 0 0 1 3 3H5a3 3 0 0 1 3-3zm5 12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6h2v1a1 1 0 0 0 2 0V6h4v1a1 1 0 0 0 2 0V6h2v8z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0071e3] px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          {user && (
            <button
              type="button"
              aria-label="Open account menu"
              aria-expanded={accountOpen}
              aria-controls="account-dropdown"
              onClick={() => setAccountOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[#f5f5f7] transition hover:bg-white/10"
            >
              <UserRound size={17} />
            </button>
          )}
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#f5f5f7] transition hover:bg-white/10"
          >
            <Menu size={21} />
          </button>
        </div>

        {user && accountOpen && (
          <div
            id="account-dropdown"
            role="menu"
            aria-label="Account options"
            className="absolute right-6 top-[calc(100%+8px)] z-[70] w-64 overflow-hidden rounded-xl border border-white/10 bg-[#242426] p-2 shadow-2xl"
          >
            <div className="border-b border-white/10 px-3 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#86868b]">Signed in as</p>
              <p className="mt-1 truncate text-sm text-[#f5f5f7]">{user.email}</p>
            </div>
            {user.uid === ADMIN_UID && (
              <Link
                to="/admin"
                role="menuitem"
                onClick={() => setAccountOpen(false)}
                className="mt-1 block rounded-lg px-3 py-2.5 text-sm text-[#dedee2] transition hover:bg-white/[0.07] hover:text-white"
              >
                Admin dashboard
              </Link>
            )}
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#dedee2] transition hover:bg-white/[0.07] hover:text-white"
            >
              Sign Out
            </button>
          </div>
        )}
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] md:hidden ${menuOpen ? 'visible' : 'invisible pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 h-full w-full bg-black/60 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={`absolute right-0 top-0 flex h-full w-[min(84vw,360px)] flex-col border-l border-white/10 bg-[#1d1d1f] px-6 pb-8 pt-5 text-[#f5f5f7] shadow-2xl transition-transform duration-300 ease-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <span className="text-sm font-semibold">Browse Black Berry</span>
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#c7c7cc] transition hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 py-5" aria-label="Mobile navigation">
            {[
              { label: 'Store', to: '/' },
              { label: 'All Products', to: '/products' },
              { label: 'Mac', to: '/products/computers' },
              { label: 'iPhone', to: '/products/mobiles' },
              { label: 'Wearables', to: '/products/wearables' },
              { label: 'Shopping Bag', to: '/cart' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-base text-[#dedee2] transition hover:bg-white/[0.07] hover:text-white"
              >
                <span className="flex items-center justify-between">
                  {item.label}
                  {item.to === '/cart' && cartCount > 0 && (
                    <span className="rounded-full bg-[#0071e3] px-2 py-0.5 text-xs text-white">{cartCount}</span>
                  )}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-white/10 pt-5">
            {user ? (
              <div className="space-y-4">
                <p className="truncate px-3 text-xs text-[#a1a1a6]">{user.displayName || user.email}</p>
                {user.uid === ADMIN_UID && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 text-sm text-[#dedee2] transition hover:bg-white/[0.07] hover:text-white"
                  >
                    Admin dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl px-3 py-3 text-left text-sm text-[#dedee2] transition hover:bg-white/[0.07] hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl bg-[#0071e3] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#1479f6]"
              >
                Sign In
              </Link>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
