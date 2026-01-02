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
  },[])

  if(loading)return <DotLoader/>
  return(
    <>
    <div className="hidden xl:block lg:block">
      <Header/>
    </div>
    <main className="lg:mt-18">
      <div className="relative w-full h-[200px] lg:h-[220px] overflow-hidden rounded-b-xl
        bg-gradient-to-b from-[#c86a2b] via-[#f2a93b] to-[#ffd166]
        "
        >
        <h1
          className="
            absolute left-5 top-8
            xl:left-1/2 lg:left-1/2
            text-[28px] sm:text-[32px]
            font-extrabold italic
            text-white
            drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]
            tracking-wide
            leading-none
          "
        >
          FLAT <span className="text-yellow-300">50%</span> OFF
        </h1>

        <img
          src="/images/offerPizza.png"
          alt="pizza"
          className="absolute right-2 top-0 h-32 xl:left-90 xl:top-0 lg:left-90 lg:top-0"
        />

        <img
          src="/images/burger2.png"
          alt="burger"
          className="absolute left-2 -bottom-2 h-28 xl:left-200 lg:left-200"
        />

        <button
          className="absolute right-12 bottom-6 bg-gray-900 opacity-80 text-white
          xl:right-150 lg:right-150 xl:px-5 xl:py-2
          px-3 py-1 rounded-full text-xs font-semibold
          hover:bg-gray-900 transition"
        >
          Order Now →
        </button>

        <div className="absolute inset-0 flex items-center justify-center">
          <SearchComp />
        </div>
      </div>

      <Category />

      <div className='h-0.5 mb-10 w-full relative bg-gray-200 font-[Reem_Kufi] font-medium flex items-center justify-center lg:justify-start xl:justify-start'>
        <h2 className='bg-[#F8FAFC] lg:ml-10 xl:ml-10 text-[#cd0045] rounded-3xl text-sm xl:text-xl px-2'>Food Categories</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-5 px-5">
        {
          products && products?.map(v=>(
            <Item item={v} />
          ))
        }
      </div>

    </main>
    
    <Nav/>
    <Cart />
    <Footer />

     {/* <div>
       <div>
        {loading? "Loading..." : (

          searchProduct.map(v =>(
            <div>
              <img src={v.img} alt={v.category} />
              <div>{v.name}</div>
          </div>
          ))
        )}
       </div>

     </div> */}


    </>
  )
}