import { useParams } from "react-router-dom"
import { useEffect , useState } from "react";
import DotLoader from '../components/DotLoader.jsx'
import api from '../services/axios.js' ;
import { useNavigate } from "react-router-dom";
import Cart from "../components/Cart.jsx";
import ItemButton from "../components/ItemButton.jsx";

export default function Items(){
  const [itemObj,setItemObj] = useState({items : [],category : ""});
  const [loading,setLoading] = useState(false);
  const {c} = useParams();
  const navigate = useNavigate();
  const {items} = itemObj 


  useEffect(()=>{
    async function fetchItem(){
      try{
        setLoading(true);
        const {data} = await api.get(`/items/category?c=${c}`);
        setItemObj(data[0]||{items : [] , category : ""});
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

       <div className="flex items-center justify-between px-3 py-2 lg:px-3 lg:py-4 border-b border-gray-700">
        <img className="h-3 opacity-80" src="/icons/leftArrow.png" alt="arrow" onClick={()=>navigate('/')} />
        <h1 className="-ml-3 text-lg font-semibold xl:text-2xl font-[REM] text-[#cd0045] ">{itemObj?.category || "Items unavailable!"}</h1>
        <div></div>
       </div>

       <div className="flex flex-wrap justify-center gap-4 py-5">
          {
            (!items.length) ? (
                <div className="w-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-5xl mb-3 animate-bounce">🍔</div>
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
                    Coming Soon
                  </h2>
                  <p className="text-sm lg:text-lg text-gray-500 mt-1">
                    We’re cooking something tasty for you
                  </p>
                </div>
              ) : 
              items?.map((v,i)=>(
              <div className="w-[290px] lg:w-[340px] bg-white rounded-xl py-5 px-3 lg:px-5 shadow-md">

                <div className="flex justify-between items-start gap-2">

                  <div className="flex flex-col gap-2">
                    <h2 className="text-sm lg:text-lg font-semibold text-gray-800">
                      {v.name}
                    </h2>
                    <p className="text-sm lg:text-lg font-bold text-gray-900">
                      ₹{v.price}
                    </p>
                    <div>
                      <img className="h-3 lg:h-4 rounded" src={v.veg ? "/icons/veg.png" : "/icons/non-veg.png"} alt="" />
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

                    <div
                      className="absolute -bottom-3 flex items-center gap-1 bg-white"
                    >
                     <ItemButton cartItem={v}/>
                    </div>
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