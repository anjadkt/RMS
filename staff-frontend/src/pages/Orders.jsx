import { useEffect, useState } from "react"
import Nav from "../components/Nav"
import OrderItems from "../components/OrderItems";
import api from "../services/axios.js";

export default function Orders(){
  const [orders,setOrders] = useState([]);
  const [loading,setLoading] = useState(false);
  const [active ,setActive] = useState("All");

  const status = [
    "All","placed","accepted","preparing","ready","served","pending","completed"
  ]

  async function fetchOrders(status) {
    try{
    setLoading(true);
    const {data} = await api.get(`/waiter/orders?s=${status === "All" ? "" : status}`);
    setOrders(data.orders);
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false)
    }
  } 

  useEffect(()=>{
    fetchOrders("All");
  },[])

  return(
    <>
     <header className="
      fixed top-0 left-0 right-0 z-40
      flex items-center gap-2
      px-4 py-2
      bg-white/90 backdrop-blur
      border-b border-[#cd0045]/20
      shadow-sm
      overflow-x-auto scrollbar-hidden
      xl:ml-42 lg:ml-42
     ">
      {
        status.map((v,i) =>(
          <div
           key={i}
           onClick={()=>{
            setActive(v);
            fetchOrders(v);
           }}
           className={`px-4 py-1 rounded-full text-xs font-semibold 
            ${active === v ? "bg-black text-white" : "text-black bg-black/5"} cursor-pointer whitespace-nowrap`}
          >{v}</div>
        ))
      }
       
     </header>
     <main className="flex flex-wrap items-center justify-center xl:ml-42 lg:ml-42 lg:mt-14 mx-4 mb-10 mt-12">
      {
        loading ? (
          <span className="h-6 w-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
        ) :
        (
          orders.length < 1 ? <h1 className="font-semibold text-gray-600">No Orders!</h1> : (
            orders.map(v =>(
            <OrderItems fetchOrders={fetchOrders} data={v} />
            ))
          )
        )
      }
     </main>
     <Nav/>
    </>
  )
}