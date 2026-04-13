import { useState } from 'react';
import { useStore, type Book } from '../store/useStore';
import { formatCurrency } from '../utils/formatters';
import { Search, Plus, X, Edit2, Trash2 } from 'lucide-react';

const Inventory = () => {
  const { books, addBook, updateBook, deleteBook, user } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: 0,
    stock: 0,
    category: '',
  });

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      updateBook(editingBook.id, formData);
    } else {
      addBook(formData);
    }
    closeModal();
  };

  const openModal = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        price: book.price,
        stock: book.stock,
        category: book.category,
      });
    } else {
      setEditingBook(null);
      setFormData({ title: '', author: '', price: 0, stock: 0, category: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        {isAdmin && (
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white p-2 rounded-lg shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search books or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-3">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">{formatCurrency(book.price)}</p>
                <p
                  className={`text-xs font-bold mt-1 ${
                    book.stock < 5 ? 'text-red-500' : 'text-green-600'
                  }`}
                >
                  {book.stock} in stock
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 font-medium">
                {book.category}
              </span>
              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(book)}
                    className="p-1.5 text-gray-400 hover:text-blue-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this book?')) deleteBook(book.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No books found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
              <button onClick={closeModal}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (₦)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-4 shadow-lg active:scale-95 transition-transform"
              >
                {editingBook ? 'Update Book' : 'Add Book'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
