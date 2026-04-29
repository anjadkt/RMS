import { Truck, MapPin, Clock } from 'lucide-react';

function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 text-slate-900">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4">Delivery Policy</h1>
          <p className="text-slate-500">How we get your food to your doorstep</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm text-center">
            <Clock className="mx-auto mb-4 text-indigo-500" size={32} />
            <h3 className="font-bold mb-2">Timeline</h3>
            <p className="text-sm text-slate-600">45 to 60 Minutes</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm text-center">
            <MapPin className="mx-auto mb-4 text-indigo-500" size={32} />
            <h3 className="font-bold mb-2">Area</h3>
            <p className="text-sm text-slate-600">10km Radius</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm text-center">
            <Truck className="mx-auto mb-4 text-indigo-500" size={32} />
            <h3 className="font-bold mb-2">Charges</h3>
            <p className="text-sm text-slate-600">Distance Based</p>
          </div>
        </div>

        <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-lg font-medium">Have questions about your delivery?</p>
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Contact)