import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Book, ShieldCheck, User } from 'lucide-react';
import type { Role } from '../types';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<Role>('Cashier');
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username, role);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-xl mb-4">
            <Book className="text-primary-600" size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">BookManager</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter your name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('Admin')}
                  className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition-all ${
                    role === 'Admin'
                      ? 'bg-primary-50 border-primary-500 text-primary-700 ring-1 ring-primary-500'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <ShieldCheck size={20} />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Cashier')}
                  className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition-all ${
                    role === 'Cashier'
                      ? 'bg-primary-50 border-primary-500 text-primary-700 ring-1 ring-primary-500'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <User size={20} />
                  <span>Cashier</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors shadow-sm"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
