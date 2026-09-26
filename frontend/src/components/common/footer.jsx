import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-[#f5f5f7] border-t border-[#d2d2d7] pt-[32px] pb-[48px] text-[12px] text-[#707070]">
      <div className="max-w-[1440px] mx-auto px-[24px]">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-[#d2d2d7]">
          <div>
            <h4 className="font-[600] text-[#1d1d1f] mb-3">Shop and Learn</h4>
            <ul className="space-y-2">
              <li><Link to="/products/computers" className="hover:underline">Computers</Link></li>
              <li><Link to="/products/mobiles" className="hover:underline">Mobiles</Link></li>
              <li><Link to="/products/wearables" className="hover:underline">Wearables</Link></li>
              <li><Link to="/products/tv-monitors" className="hover:underline">TV & Monitors</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-[600] text-[#1d1d1f] mb-3">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:underline">Manage Your Black Berry ID</Link></li>
              <li><Link to="/cart" className="hover:underline">Shopping Bag</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-[600] text-[#1d1d1f] mb-3">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/products/appliances" className="hover:underline">Appliances</Link></li>
              <li><Link to="/products" className="hover:underline">All Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-[600] text-[#1d1d1f] mb-3">Black Berry Store</h4>
            <ul className="space-y-2">
              <li><button type="button" className="hover:underline">Find a Store</button></li>
<li><button type="button" className="hover:underline">Financing</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-4 flex flex-col md:flex-row justify-between items-center text-[#707070]">
          <p>Copyright © 2026 Black Berry Inc. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
           <button type="button" className="hover:underline">Privacy Policy</button>
<button type="button" className="hover:underline">Terms of Use</button>
<button type="button" className="hover:underline">Sales Policy</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
