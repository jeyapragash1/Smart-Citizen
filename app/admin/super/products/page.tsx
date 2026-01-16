'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, Plus, Search, Edit, Trash2, X, Save, Loader2, Image as ImageIcon, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '@/lib/api'; // Import API helpers

export default function ProductAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
  };

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Baby Care',
    price: '',
    stock: '',
    event_trigger: 'Birth',
    image: '' 
  });

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    _id: '',
    name: '',
    category: 'Baby Care',
    price: '',
    stock: '',
    event_trigger: 'Birth',
    image: ''
  });

  // 1. Fetch Products on Load
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 2. Handle Form Submit
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare payload matching Backend Model
      const payload = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        event_trigger: formData.event_trigger,
        image: formData.image || "https://placehold.co/400" // Default placeholder if empty
      };

      await addProduct(payload);
      
      showNotification('success', 'Product Added Successfully!');
      setIsModalOpen(false);
      setFormData({ name: '', category: 'Baby Care', price: '', stock: '', event_trigger: 'Birth', image: '' }); // Reset form
      loadProducts(); // Refresh list

    } catch (error) {
      showNotification('error', 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Handle View
  const handleView = (product: any) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  // 4. Handle Edit
  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setEditFormData({
      _id: product._id,
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      event_trigger: product.event_trigger,
      image: product.image || ''
    });
    setIsEditModalOpen(true);
  };

  // 5. Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: editFormData.name,
        category: editFormData.category,
        price: parseFloat(editFormData.price),
        stock: parseInt(editFormData.stock),
        event_trigger: editFormData.event_trigger,
        image: editFormData.image || "https://placehold.co/400"
      };
      await updateProduct(editFormData._id, payload);
      showNotification('success', 'Product Updated Successfully!');
      setIsEditModalOpen(false);
      loadProducts();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  // 6. Handle Delete
  const handleDelete = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // 7. Confirm Delete
  const confirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct._id);
      showNotification('success', 'Product Deleted Successfully!');
      setIsDeleteModalOpen(false);
      loadProducts();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to delete product');
    }
  };

  return (
    <div className="relative">
      {notification.show && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-5 duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl ${
            notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <div>
              <p className="font-semibold">{notification.type === 'success' ? 'Success' : 'Error'}</p>
              <p className="text-sm">{notification.message}</p>
            </div>
            <button onClick={() => setNotification({ ...notification, show: false })} className="ml-4 hover:bg-white/20 p-1 rounded transition">
              <X size={18} />
            </button>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketplace Manager</h1>
            <p className="text-sm text-gray-500">Manage products shown to citizens based on life events.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md"
        >
            <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
            <div className="p-10 text-center text-gray-500">Loading products...</div>
        ) : (
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                        <th className="px-6 py-4">Product Name</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price (LKR)</th>
                        <th className="px-6 py-4">Trigger Event</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                    {products.map((p) => (
                        <tr key={p._id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-400 overflow-hidden">
                                    {p.image ? <img src={p.image} className="w-full h-full object-cover"/> : <ShoppingBag size={14}/>}
                                </div>
                                {p.name}
                            </td>
                            <td className="px-6 py-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{p.category}</span></td>
                            <td className="px-6 py-4 font-mono">Rs. {p.price}</td>
                            <td className="px-6 py-4 text-xs text-blue-600">{p.event_trigger}</td>
                            <td className="px-6 py-4 font-medium">{p.stock}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => handleView(p)}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                      title="View Details"
                                    >
                                      <Eye size={16}/>
                                    </button>
                                    <button
                                      onClick={() => handleEdit(p)}
                                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                      title="Edit Product"
                                    >
                                      <Edit size={16}/>
                                    </button>
                                    <button
                                      onClick={() => handleDelete(p)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                      title="Delete Product"
                                    >
                                      <Trash2 size={16}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                No products found. Add one to get started.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="bg-blue-900 text-white p-6 flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-2"><ShoppingBag size={20}/> Add New Product</h3>
                    <button onClick={() => setIsModalOpen(false)}><X/></button>
                </div>
                
                <form className="p-6 space-y-4" onSubmit={handleAddProduct}>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Name</label>
                        <input 
                            required 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" 
                            placeholder="e.g. Baby Milk Powder" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price (LKR)</label>
                            <input 
                                required 
                                type="number" 
                                className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" 
                                placeholder="0.00" 
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Qty</label>
                            <input 
                                required 
                                type="number" 
                                className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" 
                                placeholder="100" 
                                value={formData.stock}
                                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                            <select 
                                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option>Baby Care</option>
                                <option>Housing</option>
                                <option>Insurance</option>
                                <option>Education</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Life Event Trigger</label>
                            <select 
                                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                                value={formData.event_trigger}
                                onChange={(e) => setFormData({...formData, event_trigger: e.target.value})}
                            >
                                <option value="Birth">Birth Registration</option>
                                <option value="Marriage">Marriage Registration</option>
                                <option value="Vehicle">Vehicle Transfer</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm" 
                            placeholder="https://example.com/image.jpg" 
                            value={formData.image}
                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">* Paste a link to an image (optional)</p>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-blue-700 disabled:opacity-70"
                        >
                            {submitting ? <Loader2 className="animate-spin"/> : <><Save size={16}/> Save Product</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* View Product Modal */}
      {isViewModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsViewModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Eye size={20}/> Product Details
              </h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-white/80 hover:text-white transition">
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {selectedProduct.image ? (
                      <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name}/>
                    ) : (
                      <ShoppingBag size={32} className="text-gray-400"/>
                    )}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h4>
                    <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm mt-2">{selectedProduct.category}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price</label>
                  <p className="text-2xl font-bold text-green-600">Rs. {selectedProduct.price}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Quantity</label>
                  <p className="text-2xl font-bold text-gray-900">{selectedProduct.stock} units</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Trigger Event</label>
                  <p className="text-lg text-blue-600 font-semibold">{selectedProduct.event_trigger}</p>
                </div>
                {selectedProduct.image && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                    <p className="text-sm text-gray-600 break-all">{selectedProduct.image}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setIsViewModalOpen(false)} 
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Edit size={20}/> Edit Product
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-white/80 hover:text-white transition">
                <X size={20}/>
              </button>
            </div>
            
            <form className="p-6 space-y-4" onSubmit={handleEditSubmit}>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Name</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500" 
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price (LKR)</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500" 
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Qty</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500" 
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({...editFormData, stock: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500 bg-white" 
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                  >
                    <option value="Baby Care">Baby Care</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Automotive">Automotive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Trigger Event</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500 bg-white" 
                    value={editFormData.event_trigger}
                    onChange={(e) => setEditFormData({...editFormData, event_trigger: e.target.value})}
                  >
                    <option value="Birth">Birth Registration</option>
                    <option value="Marriage">Marriage Registration</option>
                    <option value="Vehicle">Vehicle Transfer</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-green-500 text-sm" 
                  value={editFormData.image}
                  onChange={(e) => setEditFormData({...editFormData, image: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-green-700 disabled:opacity-70"
                >
                  {submitting ? <Loader2 className="animate-spin"/> : <><Save size={16}/> Update Product</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <Trash2 size={24}/>
                </div>
                <h3 className="text-lg font-bold">Delete Product</h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <span className="font-bold text-gray-900">{selectedProduct.name}</span>?
              </p>
              <p className="text-sm text-red-600 mb-6">
                ⚠️ This action cannot be undone. The product will be permanently removed from the marketplace.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)} 
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={16}/> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}