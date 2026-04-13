import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Book, Customer, Sale, Role } from '../types';

interface State {
  user: User | null;
  books: Book[];
  customers: Customer[];
  sales: Sale[];
  login: (username: string, role: Role) => void;
  logout: () => void;
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'totalSpent'>) => void;
  addSale: (sale: Omit<Sale, 'id' | 'timestamp'>) => void;
}

const mockBooks: Book[] = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', price: 5000, stock: 15, category: 'Fiction' },
  { id: '2', title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '9780385474542', price: 4500, stock: 20, category: 'African Literature' },
  { id: '3', title: 'Half of a Yellow Sun', author: 'Chimamanda Ngozi Adichie', isbn: '9780007200283', price: 6000, stock: 10, category: 'Contemporary Fiction' },
];

export const useStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      books: mockBooks,
      customers: [],
      sales: [],

      login: (username, role) => set({
        user: { id: Math.random().toString(36).substr(2, 9), username, role }
      }),

      logout: () => set({ user: null }),

      addBook: (book) => set((state) => ({
        books: [...state.books, { ...book, id: Math.random().toString(36).substr(2, 9) }]
      })),

      updateBook: (id, updatedBook) => set((state) => ({
        books: state.books.map((b) => (b.id === id ? { ...b, ...updatedBook } : b))
      })),

      deleteBook: (id) => set((state) => ({
        books: state.books.filter((b) => b.id !== id)
      })),

      addCustomer: (customer) => set((state) => ({
        customers: [...state.customers, { ...customer, id: Math.random().toString(36).substr(2, 9), totalSpent: 0 }]
      })),

      addSale: (sale) => set((state) => {
        const newSale = {
          ...sale,
          id: `SALE-${Date.now()}`,
          timestamp: new Date().toISOString()
        };

        // Update book stock
        const updatedBooks = state.books.map(book => {
          const saleItem = sale.items.find(item => item.bookId === book.id);
          if (saleItem) {
            return { ...book, stock: book.stock - saleItem.quantity };
          }
          return book;
        });

        // Update customer total spent
        const updatedCustomers = state.customers.map(customer => {
          if (customer.id === sale.customerId) {
            return { ...customer, totalSpent: customer.totalSpent + sale.totalAmount };
          }
          return customer;
        });

        return {
          sales: [newSale, ...state.sales],
          books: updatedBooks,
          customers: updatedCustomers
        };
      }),
    }),
    {
      name: 'bookstore-storage',
    }
  )
);
