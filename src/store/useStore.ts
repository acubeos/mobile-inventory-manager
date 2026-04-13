import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  category: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface SaleItem {
  bookId: string;
  quantity: number;
  priceAtSale: number;
}

export interface Sale {
  id: string;
  customerId: string | null;
  items: SaleItem[];
  totalAmount: number;
  timestamp: number;
  cashierId: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'cashier';
}

interface StoreState {
  books: Book[];
  customers: Customer[];
  sales: Sale[];
  user: User | null;
  
  // Auth
  login: (username: string, role: 'admin' | 'cashier') => void;
  logout: () => void;
  
  // Books
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  
  // Customers
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  
  // Sales
  addSale: (sale: Omit<Sale, 'id' | 'timestamp'>) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      books: [
        { id: '1', title: 'The Lean Startup', author: 'Eric Ries', price: 5000, stock: 10, category: 'Business' },
        { id: '2', title: 'Atomic Habits', author: 'James Clear', price: 4500, stock: 15, category: 'Self-help' },
        { id: '3', title: 'Things Fall Apart', author: 'Chinua Achebe', price: 3000, stock: 20, category: 'Literature' },
      ],
      customers: [
        { id: '1', name: 'John Doe', phone: '08012345678', email: 'john@example.com' },
      ],
      sales: [],
      user: null,

      login: (username, role) => set({ user: { id: Math.random().toString(36).substr(2, 9), username, role } }),
      logout: () => set({ user: null }),

      addBook: (book) => set((state) => ({
        books: [...state.books, { ...book, id: Math.random().toString(36).substr(2, 9) }]
      })),
      updateBook: (id, updates) => set((state) => ({
        books: state.books.map((b) => (b.id === id ? { ...b, ...updates } : b))
      })),
      deleteBook: (id) => set((state) => ({
        books: state.books.filter((b) => b.id !== id)
      })),

      addCustomer: (customer) => set((state) => ({
        customers: [...state.customers, { ...customer, id: Math.random().toString(36).substr(2, 9) }]
      })),
      updateCustomer: (id, updates) => set((state) => ({
        customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c))
      })),

      addSale: (sale) => set((state) => {
        const newSale = {
          ...sale,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
        };
        
        // Update stock
        const updatedBooks = state.books.map(book => {
          const saleItem = sale.items.find(item => item.bookId === book.id);
          if (saleItem) {
            return { ...book, stock: book.stock - saleItem.quantity };
          }
          return book;
        });

        return {
          sales: [newSale, ...state.sales],
          books: updatedBooks
        };
      }),
    }),
    {
      name: 'bookstore-storage',
    }
  )
);
