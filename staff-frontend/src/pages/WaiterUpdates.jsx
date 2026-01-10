import React, { useState } from 'react';
import { Bell, Utensils, ShieldCheck, User, X } from 'lucide-react';
import Nav from '../components/Nav';

const WaiterUpdates = () => {
  const [updates, setUpdates] = useState([
    { id: 1, from: 'Chef', message: 'Order #104 is ready for pickup at the pass.', type: 'chef' },
    { id: 2, from: 'Admin', message: 'Table 5 has been reassigned to you.', type: 'admin' },
    { id: 3, from: 'Customer', message: 'Table 12 is requesting the check.', type: 'customer' },
  ]);

  const removeUpdate = (id) => {
    setUpdates(updates.filter(update => update.id !== id));
  };

  const getStyle = (type) => {
    switch (type) {
      case 'chef': return 'bg-orange-100 border-orange-500 text-orange-700';
      case 'admin': return 'bg-blue-100 border-blue-500 text-blue-700';
      case 'customer': return 'bg-green-100 border-green-500 text-green-700';
      default: return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Nav />
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-6 h-6" /> Live Updates
          </h1>
          <span className="bg-gray-200 px-3 py-1 rounded-full text-sm font-medium">
            {updates.length} Pending
          </span>
        </header>

        <div className="space-y-4">
          {updates.length > 0 ? (
            updates.map((update) => (
              <div 
                key={update.id}
                className={`flex items-start justify-between p-4 rounded-lg border-l-4 shadow-sm transition-all animate-in fade-in slide-in-from-right-4 ${getStyle(update.type)}`}
              >
                <div className="flex gap-3">
                  <div className="mt-1">
                    {update.type === 'chef' && <Utensils size={18} />}
                    {update.type === 'admin' && <ShieldCheck size={18} />}
                    {update.type === 'customer' && <User size={18} />}
                  </div>
                  <div>
                    <p className="font-bold uppercase text-xs tracking-wider">From: {update.from}</p>
                    <p className="text-sm lg:text-lg font-medium">{update.message}</p>
                  </div>
                </div>

                <button 
                  onClick={() => removeUpdate(update.id)}
                  className="p-1 hover:bg-black/5 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No new updates. All clear!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaiterUpdates;