import { RefreshCcw, XCircle } from 'lucide-react';

export default function Refund() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-3xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Refund & Cancellation</h1>
        
        <div className="space-y-10">
          <section className="bg-slate-50 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <XCircle className="text-red-500" /> Cancellation Policy
            </h2>
            <p className="text-slate-700">Orders once placed cannot be cancelled after the kitchen has started preparing the food (usually within <strong>5 minutes</strong> of order placement).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <RefreshCcw className="text-green-500" /> Refunds
            </h2>
            <p className="text-slate-700 mb-4">Refunds are only processed if:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['Order not delivered', 'Missing items', 'Tampered packaging'].map((item) => (
                <li key={item} className="flex items-center gap-2 bg-white border border-slate-100 p-3 rounded-xl text-sm font-medium text-slate-800 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" /> {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-slate-500 italic font-medium bg-indigo-50 p-4 rounded-xl border-l-4 border-indigo-500">
              Note: Approved refunds will be credited to your original payment method within 5-7 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}