import { useStore } from '../store/useStore';
import { Layout } from '../components/Layout';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Search, ReceiptText } from 'lucide-react';
import { useState } from 'react';

export const Records = () => {
  const { sales } = useStore();
  const [search, setSearch] = useState('');

  const filteredSales = sales.filter(sale => 
    sale.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    sale.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Sales Records">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="space-y-3">
          {filteredSales.map((sale) => (
            <div key={sale.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-gray-50 p-3 rounded-xl text-primary-600 shrink-0">
                <ReceiptText size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 truncate">{sale.customerName || 'Walk-in'}</h3>
                  <span className="font-bold text-gray-900 shrink-0">{formatCurrency(sale.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>ID: {sale.id.split('-')[1]}</span>
                  <span>{formatDate(sale.timestamp)}</span>
                </div>
                <div className="mt-2 flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                  {sale.items.map((item, idx) => (
                    <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-[10px] whitespace-nowrap">
                      {item.quantity}x {item.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {filteredSales.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <ReceiptText size={48} className="mx-auto mb-2 opacity-10" />
              <p>No sales records found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
