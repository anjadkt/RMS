import { ShieldCheck, Eye, Lock } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-3xl p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6 text-indigo-600">
          <ShieldCheck size={32} />
          <span className="text-sm font-bold tracking-widest uppercase">Security First</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-slate-500 mb-10 pb-6 border-b">Last updated: January 2026</p>
        
        <div className="space-y-8 text-slate-800 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-3">
              <Eye size={20} className="text-indigo-500" /> Data Collection
            </h2>
            <p>At Paragon, we value your privacy. We collect your name, phone number, and address only to process your food orders and improve your dining experience.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-3">
              <Lock size={20} className="text-indigo-500" /> Data Security
            </h2>
            <p>Your payment information is encrypted and processed by <strong>Razorpay</strong>. We do not store your credit card or bank details on our servers.</p>
          </section>
        </div>
      </div>
    </div>
  );
}