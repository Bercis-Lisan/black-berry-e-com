import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatRupees } from '../utils/productDisplay';

// Update this to your deployed backend URL when you go live
const API_BASE_URL = `${REACT_APP_API_URL}/api/payment`;

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-checkout-js')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Cart() {
  const { cartItems, removeFromCart, updateQty, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [customer, setCustomer] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  useEffect(() => {
    setCustomer((current) => ({
      ...current,
      fullName: current.fullName || user?.displayName || '',
      email: user?.email || current.email,
    }));
  }, [user]);

  const handleCustomerChange = (event) => {
    const { name, value } = event.target;
    setCustomer((current) => ({ ...current, [name]: value }));
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Failed to load Razorpay SDK. Check your internet connection.');
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Create an order on the backend for the current bag total
      const { data } = await axios.post(`${API_BASE_URL}/create-order`, {
        amount: subtotal, // in rupees
      });

      const { order, key_id } = data;

      // 2. Open Razorpay Checkout
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'Your Store',
        description: 'Order Payment',
        order_id: order.id,
        prefill: {
          name: customer.fullName,
          email: customer.email,
          contact: customer.phone,
        },
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(`${API_BASE_URL}/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              // Sent along so the backend can save this as a sale for the admin dashboard
              amount: subtotal,
              items: cartItems.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1,
              })),
              uid: user?.uid || null,
              email: customer.email,
              customer: {
                fullName: customer.fullName,
                email: customer.email,
                phone: customer.phone,
                address: {
                  line1: customer.addressLine1,
                  line2: customer.addressLine2,
                  city: customer.city,
                  state: customer.state,
                  postalCode: customer.postalCode,
                  country: customer.country,
                },
              },
            });

            if (verifyRes.data.success) {
              setPaymentSuccess(true);
              if (typeof clearCart === 'function') clearCart();
              window.alert('Order placed successfully. Thank you for shopping with us!');
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Payment verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        theme: { color: '#0071e3' },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        alert('Payment failed. Please try again.');
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Could not start checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full bg-[#f5f5f7] min-h-screen py-[56px]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">

        {paymentSuccess ? (
          <section className="mx-auto max-w-2xl rounded-3xl border border-[#d2d2d7] bg-white px-6 py-14 text-center shadow-sm sm:px-12">
            
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#0071e3]">Order confirmed</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">Thank you for your order!</h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[#707070]">
              We’re grateful you chose Black Berry. Your order is confirmed, and we’ll send updates to {customer.email}.
            </p>
            <p className="mt-3 text-sm font-medium text-[#474747]">We hope you love your new products.</p>
            <Link to="/products" className="mt-8 inline-flex rounded-full bg-[#0071e3] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#0066cc]">
              Continue shopping
            </Link>
          </section>
        ) : (
          <>
        <h1 className="text-[40px] font-[600] text-[#1d1d1f] leading-[1.14] mb-8 pb-4 border-b border-[#d2d2d7]">
          Review your Bag.
        </h1>
        <p className="-mt-4 mb-8 text-sm text-[#707070]">
          Signed in as {user?.email}. Enter your delivery details to complete your order.
        </p>

        {cartItems.length === 0 ? (
          <div className="text-center py-[64px]">
            <p className="text-[21px] font-[300] text-[#707070] mb-6">Your Bag is empty.</p>
            <Link
              to="/products"
              className="inline-block bg-[#0071e3] text-white text-[17px] rounded-[980px] px-[20px] py-[11px]"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)]">
            <div className="space-y-6">
            <section className="rounded-2xl border border-[#d2d2d7] bg-white p-5 sm:p-7">
              <h2 className="text-xl font-semibold text-[#1d1d1f]">Contact &amp; delivery</h2>
              <p className="mt-1 text-sm text-[#707070]">Where should we send your order?</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <CheckoutInput label="Full name" name="fullName" value={customer.fullName} onChange={handleCustomerChange} autoComplete="name" required />
                <CheckoutInput label="Email address" name="email" type="email" value={customer.email} onChange={handleCustomerChange} autoComplete="email" required />
                <CheckoutInput label="Phone number" name="phone" type="tel" value={customer.phone} onChange={handleCustomerChange} autoComplete="tel" required />
                <CheckoutInput label="Country" name="country" value={customer.country} onChange={handleCustomerChange} autoComplete="country-name" required />
                <CheckoutInput label="Address line 1" name="addressLine1" value={customer.addressLine1} onChange={handleCustomerChange} autoComplete="address-line1" required className="sm:col-span-2" />
                <CheckoutInput label="Address line 2 (optional)" name="addressLine2" value={customer.addressLine2} onChange={handleCustomerChange} autoComplete="address-line2" className="sm:col-span-2" />
                <CheckoutInput label="City" name="city" value={customer.city} onChange={handleCustomerChange} autoComplete="address-level2" required />
                <CheckoutInput label="State / Province" name="state" value={customer.state} onChange={handleCustomerChange} autoComplete="address-level1" required />
                <CheckoutInput label="Postal code" name="postalCode" value={customer.postalCode} onChange={handleCustomerChange} autoComplete="postal-code" required />
              </div>
            </section>

            {/* Items List */}
            <section className="space-y-4">
              <h2 className="px-1 text-xl font-semibold text-[#1d1d1f]">Your items ({cartItems.length})</h2>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#d2d2d7] bg-white p-5 sm:flex-row"
              >
                <div className="flex items-center space-x-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />
                  <div>
                    <h3 className="text-[17px] font-[600] text-[#1d1d1f]">{item.name}</h3>
                    <p className="text-[12px] text-[#858585] mt-0.5">
                      {(item.variants && item.variants[0]) || item.color || item.category || 'Standard'}
                    </p>
                    <p className="text-[14px] text-[#707070] mt-1">{formatRupees(item.price)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-[#d2d2d7] rounded-[8px] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, (item.quantity || 1) - 1)}
                      className="px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e2e2e5]"
                    >
                      -
                    </button>
                    <span className="px-4 text-[14px] font-[600]">{item.quantity || 1}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, (item.quantity || 1) + 1)}
                      className="px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e2e2e5]"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-[17px] font-[600] text-[#1d1d1f] w-20 text-right">
                    {formatRupees(item.price * (item.quantity || 1))}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-[#0066cc] text-[14px] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            </section>
            </div>

            {/* Order Summary Block */}
            <aside className="rounded-2xl border border-[#d2d2d7] bg-white p-5 sm:p-7 lg:sticky lg:top-24">
              <h2 className="mb-5 text-xl font-semibold text-[#1d1d1f]">Order summary</h2>
              <div className="mb-5 max-h-64 space-y-3 overflow-y-auto border-b border-[#e5e5e7] pb-5">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                    <span className="min-w-0 text-[#474747]">{item.name} <span className="text-[#86868b]">× {item.quantity || 1}</span></span>
                    <span className="shrink-0 font-medium text-[#1d1d1f]">{formatRupees(item.price * (item.quantity || 1))}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between py-2 text-[14px] text-[#474747]">
                <span>Subtotal</span>
                <span>{formatRupees(subtotal)}</span>
              </div>
              <div className="flex justify-between py-2 text-[14px] text-[#474747]">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between py-4 text-[21px] font-[600] text-[#1d1d1f] border-t border-[#d2d2d7] mt-2">
                <span>Grand Total</span>
                <span>{formatRupees(subtotal)}</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-4 bg-[#0071e3] text-white text-[17px] font-[400] rounded-[980px] py-[11px] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Check Out'}
              </button>
              <p className="mt-3 text-center text-xs text-[#86868b]">Secure payment powered by Razorpay.</p>

              {paymentSuccess && (
                <p className="mt-3 text-center text-[14px] text-green-600 font-[600]">
                  ✅ Payment successful! Thank you for your order.
                </p>
              )}
            </aside>
          </form>
        )}
          </>
        )}
      </div>
    </div>
  );
}

function CheckoutInput({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-[#474747]">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-[#d2d2d7] bg-white px-3 py-2.5 text-sm text-[#1d1d1f] outline-none transition focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15"
      />
    </label>
  );
}
