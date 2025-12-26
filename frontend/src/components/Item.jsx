import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay} from "swiper/modules";
import "swiper/css";

export default function Item({item}){

  return(
    <>
      <div className="shadow-xl rounded-xl overflow-hidden">

        <div className="lg:col-span-2 bg-gray-200">
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
                <div className="relative flex items-center justify-center h-[200px]">

                  <img
                    src={v.image}
                    alt={v.name}
                    className="h-38"
                  />

                  <div className="absolute top-2 left-2 bg-black/40 text-white
                  px-2 py-1 rounded-full text-xs font-medium">
                    {v.name} ₹{v.price}
                  </div>

                  <div className="absolute -bottom-2 -left-2 right-0
                  bg-gradient-to-t from-black/50 via-black/20 to-transparent
                  p-4 text-white">

                    <span className="inline-block mt-1 bg-white/80 text-[#15803D] font-bold
                    text-xs px-2 py-0.5 rounded-full">
                      <div className="flex items-center gap-1 px-1 py-0">
                        <img className="h-3" src="/icons/thunder.png" alt="thunder" />
                        <div>25–30 mins</div>
                      </div>
                    </span>

                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="py-2 px-4 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold font-[REM]">{item.category}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {item.items?.length} items available
            </p>
          </div>

          <button
            className="mt-2 w-fit border-[#cd0045] text-[#cd0045] border
            px-3 py-1.5 rounded-full text-sm font-semibold cursor-pointer hover:bg-[#cd0045] hover:text-white"
          >
            View All →
          </button>
        </div>

        <div className="py-2 px-4 flex items-center gap-1 text-xs font-medium text-gray-600">
          <img className="h-4" src="/icons/discount.png" alt="discount" />
          <div>Flat ₹75 OFF above ₹349</div>
        </div>

      </div>
    </>
  )
}