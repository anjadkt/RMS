import Header from "../components/Header";
import { useEffect,useState } from "react";
import OrderComp from "../components/OrderComp";
import api from '../services/axios.js';

export default function KitchenOrders(){
  const [active,setActive] = useState("All");
  const [orders,setOrders] = useState([]);
  const [loading,setLoading] = useState(false);


  async function fetchOrders(status) {
    try{
      setLoading(true);
      const {data} = await api.get(`/orders/cook/${status}`);
      setOrders(data);
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchOrders("all");
  },[])


  const filter = [
    {cover : "All" , value :"all" },
    {cover : "New" , value :"accepted" },
    {cover : "Preparing" , value :"preparing" },
    {cover : "Ready" , value :"ready" }
  ]
  return(
    <>
     <Header />

     <nav className="
      w-30 gap-6 flex flex-col  justify-center
      px-4 py-2
      fixed top-0 left-0 bottom-0
     ">
      {
        filter.map((v,i)=>(
          <div
           onClick={()=>{
            setActive(v.cover)
            fetchOrders(v.value)
           }}
           key={i}
           className={`
              border px-2 py-1
              cursor-pointer
              border-r border-gray-500 
              rounded-lg text-sm font-semibold shadow-sm text-center
              ${active === v.cover ? "bg-black text-white" : "hover:bg-gray-200"}
            `}
          >{v.cover}</div>
        ))
      }
      </nav>


      {
        loading ? (
          <div className="flex mt-50 justify-center">
            <span className="inline-block h-8 w-8 border-3 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <main className="mt-20 ml-34 flex flex-wrap justify-start">
            {
              orders.map(v=>(
                <OrderComp setOrders={setOrders} data={v} />
              ))
            }
          </main>
        )
      }
     
    </>
  )
}