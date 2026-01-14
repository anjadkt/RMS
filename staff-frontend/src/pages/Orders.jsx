import { useEffect, useRef, useState } from "react"
import Nav from "../components/Nav"
import OrderItems from "../components/OrderItems";
import api from "../services/axios.js";
import socket from "../services/socket.js";

export default function Orders(){
  const [orders,setOrders] = useState([]);
  const [loading,setLoading] = useState(false);
  const [active ,setActive] = useState("All");

  const soundElem = useRef(null);

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
  },[]);

  useEffect(()=>{

    const eventHandler = ({order})=>{
      setOrders(pre => {
        const exist = pre.find(v => v._id === order._id);
        if(exist)return pre ;

        return [order,...pre]
      })

      if(soundElem.current){
        soundElem.current.currentTime = 0;
        soundElem.current.play().catch(() => {
        });
      }

      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    }

    const readyEvent = ({order})=>{
      setOrders(pre =>[order,...pre]);

      if(soundElem.current){
        soundElem.current.currentTime = 0;
        soundElem.current.play().catch(() => {
        });
      }

      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    }
    socket.on("new-order",eventHandler);
    socket.on("order-ready",readyEvent);

    return ()=> {
      socket.off("new-order",eventHandler);
      socket.off("order-ready",readyEvent);
    }

  },[]);

  return(
    <div className="min-h-screen bg-slate-50">
      <header className="
        fixed top-0 left-0 right-0 z-40
        flex items-center gap-2
        px-4 py-3
        bg-white/80 backdrop-blur-md
        border-b border-slate-200
        overflow-x-auto no-scrollbar
        lg:left-54 lg:px-8
      ">
        {status.map((v, i) => (
          <button
            key={i}
            onClick={() => {
              setActive(v);
              fetchOrders(v);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap
            lg:text-sm
            ${active === v 
              ? "bg-slate-900 text-white shadow-md scale-105" 
              : "text-slate-600 bg-slate-100 hover:bg-slate-200"}`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </header>

      {/* Main Container - Adjusted for 54 width side nav */}
      <main className="pt-20 pb-24 px-4 lg:ml-54 lg:pt-24 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          orders.length < 1 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <h1 className="font-semibold text-xl">No Orders Found</h1>
              <p>Try changing the status filter</p>
            </div>
          ) : (
            /* Responsive Grid Layout */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
              {orders.map(v => (
                <OrderItems key={v._id} fetchOrders={fetchOrders} data={v} />
              ))}
            </div>
          )
        )}
      </main>
      <Nav/>
      <audio ref={soundElem} src="/sounds/waiterNoti.mp3" preload="auto" />
    </div>
  )
}