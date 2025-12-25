import { useEffect,useState } from 'react'
import Header from '../components/Header.jsx'
import api from '../services/axios.js'
import DotLoader from "../components/DotLoader.jsx"
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from 'react-router-dom';
import { Autoplay } from "swiper/modules";
import BestSeller from '../components/BestSeller.jsx';
import "swiper/css";
import Footer from '../components/Footer.jsx';

export default function Home (){
  const [loading,setLoading] = useState(false);
  const [data,setData] = useState({
    specialItems : [],
    settings : {},
    bestSelling : []
  });
  const {bestSelling,settings,specialItems} = data ;
  const navigate = useNavigate();

  const trust = [
    {text : "Freshly Cooked",img:"/icons/fresh.png" },
    {text : "4.5+ Rating",img:"/icons/rating.png" },
    {text : "Fast Delivery",img:"/icons/fast.png" },
    {text : "10k+ Orders Served",img:"/icons/serve.png" }
    
  ]

  useEffect(()=>{
    async function fetchWebData() {
      try{
        setLoading(true);
        const {data} = await api.get('/resto?settings=true&best=true&special=true');
        setData(data);
      }catch(error){

      }finally{
        setLoading(false)
      }
    }
    fetchWebData();
  },[])
  if(loading)return <DotLoader />
  return(
    <>
     <Header/>
     <main className='bg-[#F8FAFC] mb-200'>
      <div className="px-4 py-6 pb-10 lg:px-12 lg:py-12 lg:flex lg:flex-row-reverse lg:gap-5 lg:items-center">
        <div className="lg:w-1/2">
          <Swiper 
            modules={[Autoplay]}
            spaceBetween={15}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false
            }}
          >
            {settings && settings.offers?.map((offer, i) => (
              <SwiperSlide key={i}>
                <div className="flex justify-center">
                  <img
                    className="rounded-2xl shadow-lg w-full max-w-md object-cover"
                    src={offer}
                    alt="Offer"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="lg:w-1/2 text-center lg:text-left mt-8 lg:mt-0">
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight
            bg-gradient-to-r from-[#cd0045] to-[#ff6a88]
            bg-clip-text text-transparent font-REM">
            The Smarter Way to Order Food
          </h1>

          <p className="mt-4 text-gray-600 text-base sm:text-lg font-[Reem_Kufi] max-w-xl mx-auto lg:mx-0">
            No waiting, no confusion —
            <br className="hidden sm:block" />
            just smooth ordering and lightning-fast service.
          </p>

          <div className="mt-6 flex sm:flex-row justify-center lg:justify-start">
            <button
              className="px-3 py-1 mr-4 rounded-xl font-semibold text-white
              bg-gradient-to-r from-[#cd0045] to-[#ff6a88]
              hover:opacity-80 transition duration-300 shadow-md"
              onClick={()=>navigate('/')}
            >
              Start Ordering
            </button>

            <button
              className="flex items-center gap-0.5 font-medium text-gray-900
              hover:text-black transition duration-300"
            >
              <img className='h-5' src="/icons/player.png" alt="player" />
              <div>How to Order? </div>
            </button>
          </div>
        </div>
      </div>

      <div className='h-0.5 w-full relative bg-gray-200 font-[Reem_Kufi] font-medium flex items-center justify-center'>
        <h2 className='bg-[#F8FAFC] text-[#cd0045] rounded-3xl text-sm xl:text-xl px-2'>Best Selling</h2>
      </div>

      <div className='my-7 py-2 overflow-auto flex scrollbar-hide' >
        {
          bestSelling && bestSelling?.map((best,i) =>(
            <BestSeller data={best} />
          ))
        }
      </div>

      <div className='h-0.5 w-full relative bg-gray-200 font-[Reem_Kufi] font-medium flex items-center justify-center'>
        <h2 className='bg-[#F8FAFC] text-[#cd0045] rounded-3xl text-sm xl:text-xl px-2'>Today's Special</h2>
      </div>

       <div className='my-7 py-2 overflow-auto scrollbar-hide flex' >
        {
          specialItems && specialItems?.map((special,i) =>(
            <BestSeller data={special} />
          ))
        }
       </div>

       <div className='px-5 my-10'>
          <h1 className='text-xl sm:text-xl lg:text-2xl font-extrabold leading-tight
            bg-gradient-to-r from-[#cd0045] to-[#ff6a88]
            bg-clip-text text-transparent font-REM'>
              Why People Love Us ?
          </h1>

          <div className='flex flex-wrap gap-2 xl:gap-15 mt-4 font-[Reem_kufi]'>
            {
              trust.map(v =>(
                <div className='shadow-md rounded-xl px-4 py-2 flex items-center flex-col '>
                  <img className='h-6 opacity-80' src={v.img} alt="" />
                  <div className='text-gray-800'>{v.text}</div>
                </div>
              ))
            }
          </div>
       </div>

       <div className='h-0.5 w-full relative bg-gray-200 font-[Reem_Kufi] font-medium flex items-center justify-center'>
        <h2 className='bg-[#F8FAFC] text-[#cd0045] rounded-3xl text-sm xl:text-xl px-2'>Food Categories</h2>
      </div>

      <div>

      </div>


     </main>
     <Footer/>
    </>
  )
}