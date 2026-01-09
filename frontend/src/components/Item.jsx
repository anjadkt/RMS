import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useNavigate } from "react-router-dom";

export default function Item({ item }) {
  const navigate = useNavigate();

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer" 
      onClick={() => navigate(`/items/${item.category}`)}
    >
      {/* Top Section: Image Swiper */}
      <div className="relative bg-gray-50 h-[180px]">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="h-full"
        >
          {item.items?.map((v) => (
            <SwiperSlide key={v._id}>
              <div className={`relative flex items-center justify-center ${!v.isAvailable ? "grayscale pointer-events-none" : ""}  h-full p-4`}>
                <img
                  src={v.image}
                  alt={v.name}
                  className="h-full w-full object-contain drop-shadow-lg transform group-hover:scale-105 transition-transform duration-500"
                />

                {/* Individual Item Tag (Price/Name) */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-gray-100 px-3 py-1 rounded-lg shadow-sm">
                  <p className="text-[10px] font-black text-gray-800 uppercase tracking-tight leading-none">
                    {v.name} <span className="text-[#cd0045] ml-1">₹{v.price}</span>
                  </p>
                </div>

                {/* Delivery Time Badge */}
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-50">
                    <img className="h-3 w-3 animate-pulse" src="/icons/thunder.png" alt="fast" />
                    <span className="text-[10px] font-bold text-green-700 uppercase">{v.prepTime + "-" + (v.prepTime + 5)} MINS</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Bottom Section: Details */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-tighter leading-none group-hover:text-[#cd0045] transition-colors">
              {item.category}
            </h1>
            <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
              {item.items?.length} items to explore
            </p>
          </div>

          <button
            className="border-2 border-[#cd0045] text-[#cd0045] px-4 py-1 rounded-full text-[10px] font-black uppercase hover:bg-[#cd0045] hover:text-white transition-all transform active:scale-90"
          >
            Explore
          </button>
        </div>

        {/* Promo Footer */}
        <div className="pt-3 border-t border-dashed border-gray-200 flex items-center gap-2">
          <div className="bg-blue-50 p-1 rounded">
            <img className="h-3 w-3" src="/icons/discount.png" alt="discount" />
          </div>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">
            Flat ₹75 OFF above ₹349
          </p>
        </div>
      </div>
    </div>
  );
}