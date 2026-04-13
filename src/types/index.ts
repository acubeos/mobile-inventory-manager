export type Role = 'Admin' | 'Cashier';

export interface User {
  id: string;
  username: string;
  role: Role;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  price: number;
  stock: number;
  category: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
}

export interface SaleItem {
  bookId: string;
  title: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  customerId?: string;
  customerName?: string;
  cashierId: string;
  cashierName: string;
  timestamp: string;
}
