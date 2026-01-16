'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
}

export default function ShoppingCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Listen for storage changes from other components
    const handleStorageChange = () => {
      const updatedCart = localStorage.getItem('cart');
      if (updatedCart) {
        setCart(JSON.parse(updatedCart));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const removeItem = (productId: string) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setCart(cart.map(item => {
      if (item.product_id === productId) {
        const updatedTotal = item.price * newQuantity;
        return { ...item, quantity: newQuantity, total: updatedTotal };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const shipping = subtotal > 0 ? 500 : 0; // LKR 500 shipping fee
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  return (
    <>
      {/* Cart Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-blue-600 transition"
        title="Shopping Cart"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {cart.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      {isOpen && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 flex flex-col border-l border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product_id}
                  className="flex gap-4 border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.product_name}</h3>
                    <p className="text-gray-600 text-sm">
                      Rs. {item.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 border border-gray-300 rounded bg-gray-50">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      Rs. {item.total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </p>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="text-red-500 hover:text-red-700 text-sm mt-2 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {cart.length > 0 && (
            <>
              <div className="border-t border-gray-200 p-6 space-y-3 bg-gray-50">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>
                    Rs. {subtotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>
                    Rs. {shipping.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%):</span>
                  <span>
                    Rs. {tax.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold text-gray-800">
                  <span>Total:</span>
                  <span>
                    Rs. {total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="p-6 border-t border-gray-200 space-y-3">
                <Link href="/checkout">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Proceed to Checkout
                  </button>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
