import { useStore } from '../store/useStore';
import { Layout } from '../components/Layout';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, BookOpen, Users, AlertCircle, ShoppingCart } from 'lucide-react';

export const Dashboard = () => {
  const { books, sales, customers } = useStore();

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalBooksSold = sales.reduce((sum, sale) => 
    sum + sale.items.reduce((iSum, item) => iSum + item.quantity, 0), 0
  );
  const lowStockBooks = books.filter(book => book.stock < 5);

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Books Sold', value: totalBooksSold, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Inventory', value: books.length, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Customers', value: customers.length, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className={`inline-flex p-2 rounded-lg ${stat.bg} ${stat.color} mb-3`}>
                <stat.icon size={20} />
              </div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {lowStockBooks.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-red-700 mb-3">
              <AlertCircle size={20} />
              <h3 className="font-semibold text-sm">Low Stock Alerts</h3>
            </div>
            <div className="space-y-2">
              {lowStockBooks.map(book => (
                <div key={book.id} className="flex justify-between items-center text-sm bg-white p-2 rounded-lg border border-red-100">
                  <span className="font-medium text-gray-800 truncate pr-2">{book.title}</span>
                  <span className="text-red-600 font-bold shrink-0">{book.stock} left</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h3 className="font-bold text-gray-900 mb-4">Recent Sales</h3>
          <div className="space-y-4">
            {sales.slice(0, 5).map((sale) => (
              <div key={sale.id} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {sale.customerName || 'Walk-in Customer'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {sale.items.length} items • {new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <p className="font-bold text-gray-900">{formatCurrency(sale.totalAmount)}</p>
              </div>
            ))}
            {sales.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-4">No sales recorded yet</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
