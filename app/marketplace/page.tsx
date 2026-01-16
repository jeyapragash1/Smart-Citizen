'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Star, Loader2, PackageX, Search, Filter, Heart, ShoppingCart, Zap, TrendingUp, Award, Truck } from 'lucide-react';
import { getAllProducts } from '@/lib/api';
import ShoppingCartComponent from '@/components/ShoppingCart';

interface CartItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart:', e);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(p => p.price >= min && (!max || p.price <= max));
    }
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
        break;
      default:
        break;
    }
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const categories = Array.from(new Set(products.map(p => p.category)));
  
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.product_id === product._id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product_id === product._id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, {
        product_id: product._id,
        product_name: product.name,
        price: product.price,
        quantity: 1,
        total: product.price,
      }]);
    }

    // Show notification
    setNotification(`✅ "${product.name}" added to cart!`);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white py-5 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 animate-bounce" />
            <span className="font-bold text-lg">🎉 LIMITED TIME: 25% off Everything! Code: SPECIAL25</span>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          {notification}
        </div>
      )}

      <div className="bg-gradient-to-b from-gray-50 to-white border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition">
                <ArrowLeft className="w-5 h-5 text-blue-600" />
              </Link>
              <div>
                <h1 className="text-5xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
                  <ShoppingBag className="w-10 h-10 text-blue-600" />
                  Smart Marketplace
                </h1>
                <p className="text-gray-600 text-sm mt-2 font-medium">Premium products handpicked for your lifestyle</p>
              </div>
            </div>
            <ShoppingCartComponent />
          </div>
          <div className="relative">
            <Search className="absolute left-5 top-4 text-blue-500 w-5 h-5" />
            <input
              type="text"
              placeholder="🔍 Find your perfect product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-13 pr-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-medium text-gray-700 placeholder-gray-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-gray-50 to-white rounded-3xl border-2 border-gray-200 p-7 sticky top-8 shadow-lg">
              <h2 className="text-xl font-black text-gray-900 mb-7 flex items-center gap-3 uppercase tracking-wide">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Filter className="w-5 h-5 text-blue-600" />
                </div>
                Filters
              </h2>

              <div className="mb-8">
                <h3 className="font-black text-gray-900 mb-4 text-xs uppercase tracking-widest">📁 Category</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`block w-full text-left px-4 py-3 rounded-xl transition text-sm font-bold ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left px-4 py-3 rounded-xl transition text-sm font-bold ${
                        selectedCategory === cat
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8 pb-8 border-b-2 border-gray-200">
                <h3 className="font-black text-gray-900 mb-4 text-xs uppercase tracking-widest">💰 Price Range</h3>
                <div className="space-y-2">
                  {[
                    { label: 'All Prices', value: 'all' },
                    { label: 'Under Rs. 5,000', value: '0-5000' },
                    { label: 'Rs. 5,000 - Rs. 15,000', value: '5000-15000' },
                    { label: 'Rs. 15,000 - Rs. 50,000', value: '15000-50000' },
                    { label: 'Above Rs. 50,000', value: '50000-999999' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPriceRange(option.value)}
                      className={`block w-full text-left px-4 py-3 rounded-xl transition text-sm font-bold ${
                        priceRange === option.value
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange('all');
                  setSortBy('trending');
                }}
                className="w-full py-3 px-4 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition font-bold text-sm uppercase tracking-wide"
              >
                ↺ Reset Filters
              </button>
            </div>

            <div className="mt-8 bg-gradient-to-b from-blue-50 to-white rounded-3xl border-2 border-blue-200 p-7 shadow-lg">
              <h3 className="font-black text-gray-900 mb-5 text-sm uppercase tracking-wide">✨ Why Shop Here?</h3>
              <div className="space-y-5">
                <div className="flex gap-3 p-3 bg-blue-100 rounded-xl">
                  <Truck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-gray-900 text-sm">⚡ Fast Delivery</p>
                    <p className="text-gray-700 text-xs font-medium">Within 2-3 business days</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-green-100 rounded-xl">
                  <Award className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-gray-900 text-sm">✓ Verified Products</p>
                    <p className="text-gray-700 text-xs font-medium">100% authentic items</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-orange-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-gray-900 text-sm">🏆 Best Prices</p>
                    <p className="text-gray-700 text-xs font-medium">Matched with market rates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-200 shadow-md">
              <p className="text-gray-700 font-bold text-lg">
                Showing <span className="text-blue-600 font-black text-xl">{filteredProducts.length}</span> products
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold bg-white hover:border-blue-400 transition"
              >
                <option value="trending">🔥 Trending</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="rating">⭐ Top Rated</option>
              </select>
            </div>

            {loading && (
              <div className="h-80 flex flex-col items-center justify-center text-gray-500">
                <Loader2 size={48} className="animate-spin mb-3 text-blue-600" />
                <p className="text-lg font-semibold">Loading Best Offers...</p>
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="h-80 flex flex-col items-center justify-center text-gray-400 bg-gradient-to-b from-gray-50 to-white rounded-3xl border-2 border-gray-200">
                <PackageX size={72} className="mb-4 text-gray-300" />
                <p className="text-2xl font-black mb-2 text-gray-900">No products found</p>
                <p className="text-gray-600 mb-8 font-semibold">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPriceRange('all');
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black hover:shadow-lg transition uppercase tracking-wide"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {!loading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
                {filteredProducts.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-2xl transition-all group transform hover:scale-105 duration-300"
                  >
                    <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center">
                      {item.image.startsWith('http') ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover group-hover:scale-125 transition-transform duration-500"
                        />
                      ) : (
                        <span className="text-7xl animate-bounce">🛍️</span>
                      )}

                      <button
                        onClick={() => toggleWishlist(item._id)}
                        className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-xl hover:bg-red-50 transition transform hover:scale-110 duration-300"
                      >
                        <Heart
                          className={`w-6 h-6 transition ${
                            wishlist.includes(item._id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        />
                      </button>

                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black rounded-full shadow-lg uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center text-yellow-500 gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < 4 ? 'fill-yellow-500' : 'fill-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-black text-gray-600">(4.8) ⭐</span>
                      </div>

                      <h3 className="text-lg font-black text-gray-900 mb-3 line-clamp-2 tracking-tight">{item.name}</h3>

                      <div className="mb-6 p-3 bg-blue-50 rounded-xl">
                        <p className="text-3xl font-black text-blue-600">Rs. {item.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 line-through font-semibold">Rs. {Math.round(item.price * 1.2).toLocaleString()}</p>
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 group/btn uppercase tracking-wider"
                      >
                        <ShoppingCart className="w-5 h-5 group-hover/btn:scale-125 transition" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {!loading && filteredProducts.length > 0 && (
        <div className="mt-20 px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl border-2 border-blue-200 bg-gradient-to-b from-blue-50 via-white to-indigo-50 p-12 shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full -mr-32 -mt-32 opacity-40"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-100 rounded-full -ml-24 -mb-24 opacity-40"></div>
              
              <div className="relative z-10 text-center">
                <div className="inline-block mb-6 p-4 bg-blue-100 rounded-full">
                  <span className="text-4xl">💌</span>
                </div>
                
                <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent uppercase tracking-tight">
                  Get Exclusive Deals
                </h2>
                
                <p className="mb-10 text-lg font-semibold text-gray-700 max-w-xl mx-auto leading-relaxed">
                  Subscribe to our newsletter for special offers, early access to new products & exclusive discounts!
                </p>
                
                <div className="flex gap-3 flex-col sm:flex-row max-w-lg mx-auto mb-6">
                  <input
                    type="email"
                    placeholder="✉️ Enter your email..."
                    className="flex-1 px-6 py-4 rounded-2xl border-2 border-blue-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold shadow-sm hover:border-blue-300 transition"
                  />
                  <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black hover:shadow-xl transition transform hover:scale-105 uppercase tracking-wider">
                    Subscribe
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 font-medium">🔒 We respect your privacy. Unsubscribe anytime.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
