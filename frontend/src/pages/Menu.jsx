import Header from "../components/Header";
import Category from '../components/Category.jsx'
import api from "../services/axios";
import {useEffect, useState} from 'react'
import Item from "../components/Item.jsx";
import Footer from '../components/Footer.jsx';
import DotLoader from '../components/DotLoader.jsx' ;
import Nav from "../components/Nav.jsx";
import Cart from "../components/Cart.jsx";
import SearchComp from "../components/SerachComp.jsx";

export default function Menu (){
  const [loading,setLoading] = useState(false);
  const [products ,setProduct] = useState([]);

  useEffect(()=>{
    async function fetchItems() {
      try{
        setLoading(true);
        const {data}  = await api.get('/items/category');
        setProduct(data);
      }catch(error){
        console.log(error.message);
      }finally{
        setLoading(false);
      }
    }
    fetchItems();
  }, [])

  if(loading) return <DotLoader/>

  return(
    <>
    
    <Header/>
    
    <main className="mt-16 pb-20">
      {/* HERO WRAPPER - This contains the banner + the overlapping search bar */}
     <div className="w-full flex justify-center py-4 lg:py-4 px-5">
      <div className="w-full max-w-lg transform transition-all duration-300 focus-within:scale-[1.02]">
          <SearchComp />
      </div>
     </div>
     
     <div className="px-5 mb-12">
        <div className="relative mx-auto max-w-7xl h-[200px] lg:h-[300px] rounded-[2.5rem] bg-[#1a1a1a] overflow-hidden shadow-2xl">
          
          {/* Background Abstract Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 rounded-full bg-[#cd0045] blur-[100px]"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 rounded-full bg-orange-500 blur-[100px]"></div>
          </div>

          <div className="relative z-10 flex items-center h-full px-8 lg:px-20">
            {/* Left Side: Text */}
            <div className="flex-1">
              <p className="text-[#cd0045] font-bold tracking-[0.3em] text-[10px] lg:text-sm mb-2 uppercase">
                Limited Time Offer
              </p>
              <h1 className="text-white text-[32px] lg:text-[60px] font-black leading-none mb-4">
                FLAT <span className="text-orange-500">50%</span> <br/> 
                <span className="text-gray-400">DISCOUNT</span>
              </h1>
              <button className="bg-white text-black text-[10px] lg:text-sm font-black px-6 py-2 lg:px-8 lg:py-3 rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-lg uppercase">
                Claim Offer
              </button>
            </div>

            {/* Right Side: Visuals */}
            <div className="hidden sm:flex flex-1 relative h-full items-center justify-end">
              {/* Main Pizza - Large and detailed */}
              <img 
                src="/images/offerPizza.png" 
                className="h-[140%] lg:h-[130%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] rotate-[-10deg] translate-x-10 translate-y-5"
                alt="promo"
              />
              {/* Burger - Smaller accent item */}
              <img 
                src="/images/burger2.png" 
                className="absolute -left-10 bottom-4 h-32 lg:h-52 object-contain drop-shadow-2xl rotate-[15deg] hidden lg:block"
                alt="promo"
              />
            </div>

            {/* Mobile Pizza (Visible only on small screens) */}
            <img 
              src="/images/offerPizza.png" 
              className="sm:hidden absolute -right-12 top-1/2 -translate-y-1/2 h-full object-contain opacity-80 rotate-12"
              alt="promo"
            />
          </div>
        </div>
     </div>

      {/* REST OF THE PAGE */}
      <div className="mt-12 lg:mt-16">
        <Category />
      </div>

      <div className='my-10 px-6 flex items-center justify-between max-w-7xl mx-auto'>
        <div className="flex flex-col">
          <h2 className='text-2xl lg:text-4xl font-black text-gray-900 font-[REM]'>Our Menu</h2>
          <div className="h-1.5 w-12 bg-[#cd0045] rounded-full mt-1"></div>
        </div>
        <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest hidden sm:block">
          Fastest Delivery
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
        {products?.map(v=>(
            <Item key={v.category} item={v} />
        ))}
      </div>
    </main>
    
    <Nav/>
    <Cart />
    <Footer />
    </>
  )
}