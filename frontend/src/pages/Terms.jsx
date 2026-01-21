import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-3xl p-8 md:p-12 text-slate-900">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">Terms & Conditions</h1>
            <p className="text-slate-500">Agreement of Service</p>
          </div>
          <FileText size={40} className="text-slate-200" />
        </div>

        <div className="space-y-8 divide-y divide-slate-100">
          <div className="pt-0">
            <h2 className="text-lg font-bold mb-3">1. Use of Service</h2>
            <p className="text-slate-600 leading-relaxed">Our services are intended for personal use. You agree not to misuse the platform for fraudulent bookings or orders.</p>
          </div>
          
          <div className="pt-6">
            <h2 className="text-lg font-bold mb-3">2. Pricing & Payment</h2>
            <p className="text-slate-600 leading-relaxed">All prices are in INR and include applicable taxes. Payments are processed securely via Razorpay.</p>
          </div>

          <div className="pt-6">
            <h2 className="text-lg font-bold mb-3">3. Accuracy of Information</h2>
            <p className="text-slate-600 leading-relaxed">We strive to keep our menu updated. However, slight variations in the actual dish vs. images may occur.</p>
          </div>
        </div>
      </div>
    </div>
  );
}