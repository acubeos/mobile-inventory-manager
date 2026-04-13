import { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/formatters';
import { Search, Plus, Minus, ShoppingCart, Trash2, X, Check } from 'lucide-react';

const Sales = () => {
  const { books, customers, addSale, user } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{ bookId: string; quantity: number }[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const filteredBooks = books.filter(
    (book) =>
      book.stock > 0 &&
      (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addToCart = (bookId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.bookId === bookId);
      const book = books.find((b) => b.id === bookId);
      if (existing) {
        if (existing.quantity < (book?.stock || 0)) {
          return prev.map((item) =>
            item.bookId === bookId ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return prev;
      }
      return [...prev, { bookId, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.bookId === bookId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (bookId: string) => {
    setCart((prev) => prev.filter((item) => item.bookId !== bookId));
  };

  const cartItems = cart.map((item) => {
    const book = books.find((b) => b.id === item.bookId)!;
    return { ...item, book };
  });

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    addSale({
      customerId: selectedCustomerId,
      items: cartItems.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity,
        priceAtSale: item.book.price,
      })),
      totalAmount,
      cashierId: user?.id || 'unknown',
    });

    setCart([]);
    setSelectedCustomerId(null);
    setShowCheckout(false);
    alert('Sale recorded successfully!');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">New Sale</h1>
        <div className="relative">
          <ShoppingCart className="w-6 h-6 text-gray-400" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cart.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredBooks.map((book) => {
          const cartItem = cart.find((i) => i.bookId === book.id);
          return (
            <div
              key={book.id}
              className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center"
            >
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900">{book.title}</h3>
                <p className="text-xs text-gray-500">{formatCurrency(book.price)} • {book.stock} in stock</p>
              </div>
              <div className="flex items-center gap-2">
                {cartItem ? (
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => removeFromCart(book.id)}
                      className="p-1 hover:text-blue-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(book.id)}
                      disabled={cartItem.quantity >= book.stock}
                      className="p-1 hover:text-blue-600 disabled:text-gray-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(book.id)}
                    className="bg-blue-600 text-white p-2 rounded-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto">
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl shadow-xl flex justify-between items-center px-6 active:scale-95 transition-transform"
          >
            <div className="text-left">
              <p className="text-xs opacity-80 uppercase font-bold tracking-wider">Checkout</p>
              <p className="text-lg font-bold">{formatCurrency(totalAmount)}</p>
            </div>
            <ShoppingCart className="w-6 h-6" />
          </button>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 space-y-6 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Order Summary</h2>
              <button onClick={() => setShowCheckout(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.bookId} className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm">{item.book.title}</h4>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x {formatCurrency(item.book.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-sm">
                        {formatCurrency(item.quantity * item.book.price)}
                      </p>
                      <button
                        onClick={() => removeItem(item.bookId)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Assign Customer (Optional)</label>
                <select
                  value={selectedCustomerId || ''}
                  onChange={(e) => setSelectedCustomerId(e.target.value || null)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                >
                  <option value="">Guest Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <Check className="w-6 h-6" /> Complete Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
