import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DotLoader from "./DotLoader";
import { useSelector, useDispatch } from 'react-redux';
import { setIsVisible } from "../app/features/website/webSlice.js";

export default function MainOfferWrapper({ children }) {
  const [timeLeft, setTimeLeft] = useState(10);
  const dispatch = useDispatch();
  const { loading, offer, isVisible } = useSelector(state => state.website);
  const navigate = useNavigate();

  useEffect(() => {

    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const autoClose = setTimeout(() => {
      dispatch(setIsVisible());
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(autoClose);
    };
  }, [dispatch]);

  if (loading) return <DotLoader />;
  if (!isVisible) return <>{children}</>;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
        
        {/* Simplified Compact Card */}
        <div className="relative w-full max-w-[320px] bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Subtle Countdown Tag */}
          <div className="absolute top-3 right-3 z-10 flex items-center py-1 bg-gray-900/10 backdrop-blur-md px-2 rounded-full">
            <span className="text-[10px] font-bold text-gray-600 px-1">Close in {timeLeft}s</span>
          </div>

          {/* Minimal Content */}
          <div className="p-6 flex flex-col items-center text-center">
            
            {/* Small Floating Product Image */}
            <div className="w-32 h-32 mb-4 drop-shadow-xl">
              <img 
                src={offer?.product?.image} 
                className="w-full h-full object-contain"
                alt="product"
              />
            </div>

            <div className="space-y-1 mb-6">
              <span className="text-[10px] font-black text-[#cd0045] uppercase tracking-widest">
                Exclusive Offer
              </span>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight font-[REM]">
                {offer?.title}
              </h2>
              <p className="text-[11px] font-medium text-gray-400 leading-tight px-4">
                Grab this {offer?.product?.name} before the timer runs out!
              </p>
            </div>

            {/* Clean, Simple Buttons */}
            <div className="w-full space-y-2">
              <button 
                onClick={() => {
                  navigate(`/items/${offer?.product?.category}`);
                  dispatch(setIsVisible());
                }}
                className="w-full py-3 bg-[#cd0045] text-white rounded-xl font-bold uppercase tracking-tighter text-xs shadow-md active:scale-95 transition-all"
              >
                Claim for ₹{offer?.product?.price}
              </button>
              
              <button 
                onClick={() => dispatch(setIsVisible())}
                className="w-full py-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}