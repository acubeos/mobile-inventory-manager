import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Layout } from '../components/Layout';
import { Search, ShoppingCart, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import type { Book, SaleItem } from '../types';

export const Sales = () => {
  const { books, customers, addSale, user } = useStore();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredBooks = books.filter(book => 
    book.stock > 0 &&
    (book.title.toLowerCase().includes(search.toLowerCase()) || book.author.toLowerCase().includes(search.toLowerCase()))
  );

  const addToCart = (book: Book) => {
    setCart(prev => {
      const existing = prev.find(item => item.bookId === book.id);
      if (existing) {
        if (existing.quantity >= book.stock) return prev;
        return prev.map(item => item.bookId === book.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { bookId: book.id, title: book.title, quantity: 1, price: book.price }];
    });
  };

  const updateQuantity = (bookId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.bookId === bookId) {
        const book = books.find(b => b.id === bookId);
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (book && newQty > book.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (bookId: string) => {
    setCart(prev => prev.filter(item => item.bookId !== bookId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0 || !user) return;

    const customer = customers.find(c => c.id === selectedCustomerId);

    addSale({
      items: cart,
      totalAmount: total,
      customerId: selectedCustomerId || undefined,
      customerName: customer?.name || 'Walk-in Customer',
      cashierId: user.id,
      cashierName: user.username,
    });

    setCart([]);
    setSelectedCustomerId('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <Layout title="New Sale">
      <div className="space-y-6">
        {/* Success Alert */}
        {isSuccess && (
          <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 size={20} />
            <span className="font-medium">Sale recorded successfully!</span>
          </div>
        )}

        {/* Customer Selection */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer (Optional)</label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
          >
            <option value="">Walk-in Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Search and Book List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Add books to cart..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none"
            />
          </div>

          {search && (
            <div className="bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto z-10">
              {filteredBooks.map(book => (
                <button
                  key={book.id}
                  onClick={() => { addToCart(book); setSearch(''); }}
                  className="w-full flex justify-between items-center p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                >
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">{book.title}</p>
                    <p className="text-xs text-gray-500">{book.stock} in stock</p>
                  </div>
                  <span className="text-sm font-medium text-primary-600">{formatCurrency(book.price)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[300px]">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart size={18} />
              Current Cart
            </h3>
            <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full text-gray-600">
              {cart.length} items
            </span>
          </div>

          <div className="flex-1 p-4 space-y-4">
            {cart.map(item => (
              <div key={item.bookId} className="flex justify-between items-center">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(item.price)} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.bookId, -1)} className="p-1 hover:bg-gray-50"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.bookId, 1)} className="p-1 hover:bg-gray-50"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.bookId)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                <ShoppingCart size={48} className="mb-2 opacity-20" />
                <p>Your cart is empty</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-b-2xl border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 disabled:bg-gray-300 transition-all shadow-lg"
            >
              Confirm Checkout
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
