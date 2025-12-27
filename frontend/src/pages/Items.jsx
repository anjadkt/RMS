import { useParams } from "react-router-dom"
import { useEffect , useState } from "react";
import DotLoader from '../components/DotLoader.jsx'
import api from '../services/axios.js' ;
import { useNavigate } from "react-router-dom";
import Cart from "../components/Cart.jsx";

export default function Items(){
  const [itemObj,setItemObj] = useState({});
  const [loading,setLoading] = useState(false);
  const {c} = useParams();
  const navigate = useNavigate();
  const {items} = itemObj || []


  useEffect(()=>{
    async function fetchItem(){
      try{
        setLoading(true);
        const {data} = await api.get(`/items/category?c=${c}`);
        setItemObj(data[0]);
      }catch(error){
        console.log(error.message);
      }finally{
        setLoading(false);
      }
    }
    fetchItem();
  },[]);

  if(loading)return <DotLoader/>
  return(
    <>
     <main className="mb-20">
       <div className="flex items-center justify-between px-3 py-2 xl:px-5 xl:py-3 lg:px-3 lg:py-4 border-b border-gray-700">
        <img className="h-3 opacity-80" src="/icons/leftArrow.png" alt="arrow" onClick={()=>navigate('/')} />
        <h1 className="-ml-3 text-lg font-semibold xl:text-2xl font-[REM] text-[#cd0045] ">{itemObj.category || "404"}</h1>
        <div></div>
       </div>
       <div className="flex flex-wrap justify-center gap-4 py-5">
          {
            items?.map((v,i)=>(
              <div className="w-[290px] bg-white rounded-xl py-5 px-3 shadow-md">

                <div className="flex justify-between items-start gap-2">

                  <div className="flex flex-col gap-2">
                    <h2 className="text-sm font-semibold text-gray-800">
                      {v.name}
                    </h2>
                    <p className="text-sm font-bold text-gray-900">
                      ₹{v.price}
                    </p>
                    <div>
                      <img className="h-3 rounded" src={v.veg ? "/icons/veg.png" : "/icons/non-veg.png"} alt="" />
                    </div>
                    {
                      v.offers ? (
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                          <img className="h-4" src="/icons/discount.png" alt="discount" />
                          <div>Flat ₹75 OFF</div>
                        </div>
                      ) : <div></div>
                    }
                  </div>

                  <div className="relative flex flex-col items-center bg-gray-200 p-2 rounded-lg">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="h-24 object-cover"
                    />

                    <button
                      className="absolute -bottom-3 flex items-center gap-1
                      border border-[#cd0045] text-[#cd0045]
                      bg-white px-6 py-1.5 rounded-sm
                      text-xs font-bold
                      hover:bg-[#cd0045] hover:text-white
                      transition"
                    >
                      ADD
                      <span className="text-sm font-bold absolute -top-1 right-1">+</span>
                    </button>
                  </div>

                </div>
              </div>
            ))
          }
       </div>
     </main>
     <Cart isItems= {true} />
    </>
  )
}