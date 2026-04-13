import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, BookOpen, Users, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { books, sales, customers } = useStore();

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const totalSalesCount = sales.length;
  const lowStockBooks = books.filter((book) => book.stock < 5);
  
  const stats = [
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      label: 'Total Sales',
      value: totalSalesCount.toString(),
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      label: 'Customers',
      value: customers.length.toString(),
      icon: Users,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Overview of your bookstore performance</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-lg text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {lowStockBooks.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800 uppercase text-xs tracking-wider">Low Stock Alerts</h3>
          </div>
          <div className="space-y-2">
            {lowStockBooks.slice(0, 3).map((book) => (
              <div key={book.id} className="flex justify-between items-center text-sm">
                <span className="text-amber-900 font-medium">{book.title}</span>
                <span className="bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full text-xs font-bold">
                  {book.stock} left
                </span>
              </div>
            ))}
            {lowStockBooks.length > 3 && (
              <Link to="/inventory" className="text-xs text-amber-700 font-bold flex items-center gap-1 mt-2">
                See all {lowStockBooks.length} alerts <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Sales</h2>
          <Link to="/records" className="text-sm text-blue-600 font-medium">View all</Link>
        </div>
        <div className="space-y-3">
          {sales.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center">
              <p className="text-gray-500 text-sm">No sales recorded yet</p>
            </div>
          ) : (
            sales.slice(0, 5).map((sale) => (
              <div key={sale.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(sale.totalAmount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {sale.items.length} items • {new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold text-gray-600">
                  #{sale.id.slice(-4).toUpperCase()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
