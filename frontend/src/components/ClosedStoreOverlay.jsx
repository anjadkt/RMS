import { MoonStar, Clock} from 'lucide-react';

const ClosedStoreOverlay = () => {

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-6 font-sans">

      <div className="max-w-md w-full text-center">
        {/* Animated Icon Header */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-rose-300 blur-[80px] rounded-full opacity-20 animate-pulse" />
          <div className="relative bg-white w-28 h-28 rounded-[40px] shadow-2xl shadow-rose-200 flex items-center justify-center mx-auto transform -rotate-6">
            <MoonStar size={48} className="text-rose-500 fill-rose-50" strokeWidth={1.5} />
          </div>
          {/* Decorative Zzz's */}
          <span className="absolute top-0 right-1/3 text-rose-300 font-black text-xl animate-bounce delay-100">Z</span>
          <span className="absolute -top-4 right-1/4 text-rose-200 font-black text-sm animate-bounce">z</span>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-black text-rose-950 mb-4 tracking-tight leading-tight">
          We’re Recharging <br />Our Kitchen
        </h1>
        <p className="text-sm font-bold leading-relaxed mb-10 text-rose-800/50 max-w-[280px] mx-auto">
          We are currently closed to prepare fresh ingredients for your next meal.
        </p>

        {/* Info Card */}
        <div className="bg-white/70 border border-white rounded-[32px] p-6 backdrop-blur-md shadow-xl shadow-rose-900/5 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black text-rose-950/30 uppercase tracking-[0.2em] mb-1">Status</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-xs font-black text-rose-600 uppercase">Currently Offline</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-rose-50 flex items-center justify-center">
              <Clock size={20} className="text-rose-600" />
            </div>
          </div>
          
          <div className="h-[1px] bg-rose-100 w-full mb-6" />

          <div className="text-left">
            <p className="text-[10px] font-black text-rose-950/30 uppercase tracking-[0.2em] mb-2">Back Online In</p>
            <p className="text-2xl font-black text-rose-950">Tomorrow, 09:00 AM</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClosedStoreOverlay;