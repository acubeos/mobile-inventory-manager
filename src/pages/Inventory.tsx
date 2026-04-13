import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Layout } from '../components/Layout';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import type { Book } from '../types';

export const Inventory = () => {
  const { books, addBook, updateBook, deleteBook, user } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    book.isbn.includes(search)
  );

  const isAdmin = user?.role === 'Admin';

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    price: 0,
    stock: 0,
    category: ''
  });

  const handleOpenAdd = () => {
    setEditingBook(null);
    setFormData({ title: '', author: '', isbn: '', price: 0, stock: 0, category: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({ ...book });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      updateBook(editingBook.id, formData);
    } else {
      addBook(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <Layout title="Inventory">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search books, authors, ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          {isAdmin && (
            <button
              onClick={handleOpenAdd}
              className="bg-primary-600 text-white p-2 rounded-xl hover:bg-primary-700 transition-colors"
            >
              <Plus size={24} />
            </button>
          )}
        </div>

        <div className="grid gap-3">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author}</p>
                <div className="flex gap-4 mt-2">
                  <span className="text-sm font-bold text-primary-600">{formatCurrency(book.price)}</span>
                  <span className={`text-sm font-medium ${book.stock < 5 ? 'text-red-600' : 'text-gray-600'}`}>
                    Stock: {book.stock}
                  </span>
                </div>
              </div>
              {isAdmin && (
                <div className="flex gap-1">
                  <button onClick={() => handleOpenEdit(book)} className="p-2 text-gray-400 hover:text-primary-600">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => deleteBook(book.id)} className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[60] px-4">
            <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
                <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                    <input
                      type="text"
                      required
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors mt-4"
                >
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
