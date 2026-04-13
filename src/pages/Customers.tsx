import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Layout } from '../components/Layout';
import { Plus, Search, User, Phone, Mail, X } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const Customers = () => {
  const { customers, addCustomer } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(formData);
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', email: '' });
  };

  return (
    <Layout title="Customers">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 text-white p-2 rounded-xl"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="space-y-3">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-50 p-2 rounded-full text-primary-600">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{customer.name}</h3>
                    <p className="text-xs text-gray-500">Member since {new Date().getFullYear()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase">Total Spent</p>
                  <p className="font-bold text-primary-600">{formatCurrency(customer.totalSpent)}</p>
                </div>
              </div>
              <div className="flex gap-4 border-t border-gray-50 pt-3">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  {customer.phone}
                </div>
                {customer.email && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 truncate">
                    <Mail size={14} className="text-gray-400" />
                    {customer.email}
                  </div>
                )}
              </div>
            </div>
          ))}
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <User size={48} className="mx-auto mb-2 opacity-10" />
              <p>No customers found</p>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[60] px-4">
            <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">New Customer</h2>
                <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold mt-4"
                >
                  Create Profile
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
