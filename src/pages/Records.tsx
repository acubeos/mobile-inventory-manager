import { useStore } from '../store/useStore';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ShoppingBag, Calendar, User, Hash } from 'lucide-react';

const Records = () => {
  const { sales, customers, books } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
          {sales.length} Sales
        </div>
      </div>

      <div className="space-y-4">
        {sales.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          sales.map((sale) => {
            const customer = customers.find((c) => c.id === sale.customerId);
            return (
              <div key={sale.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      {sale.id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(sale.timestamp)}
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    {sale.items.map((item, idx) => {
                      const book = books.find((b) => b.id === item.bookId);
                      return (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700 font-medium truncate max-w-[200px]">
                            {item.quantity}x {book?.title || 'Unknown Book'}
                          </span>
                          <span className="text-gray-500">{formatCurrency(item.priceAtSale * item.quantity)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 p-1.5 rounded-lg">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {customer?.name || 'Guest Customer'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-medium">Total Paid</p>
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(sale.totalAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Records;
