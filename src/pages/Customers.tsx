import { useState } from 'react';
import { useStore, type Customer } from '../store/useStore';
import { Search, Plus, User, Phone, Mail, X } from 'lucide-react';

const Customers = () => {
  const { customers, addCustomer, updateCustomer } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
    } else {
      addCustomer(formData);
    }
    closeModal();
  };

  const openModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
      });
    } else {
      setEditingCustomer(null);
      setFormData({ name: '', phone: '', email: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white p-2 rounded-lg shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-3">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            onClick={() => openModal(customer)}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 active:bg-gray-50 transition-colors"
          >
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{customer.name}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Phone className="w-3 h-3" /> {customer.phone}
                </span>
                {customer.email && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Mail className="w-3 h-3" /> {customer.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No customers found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
              <button onClick={closeModal}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address (Optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-4 shadow-lg active:scale-95 transition-transform"
              >
                {editingCustomer ? 'Update Customer' : 'Save Customer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
