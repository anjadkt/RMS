import {useNavigate} from "react-router-dom"
import {useState,useEffect} from 'react'
import api from "../services/axios";
import DotLoader from "../components/DotLoader";
import OrderHistory from "../components/Order.jsx"
import Nav from '../components/Nav.jsx'
import Header from "../components/Header.jsx";

export default function History(){
  const [orders,setOrders] = useState([]);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    async function fetchOrders() {
      try{
        setLoading(true);
        const {data} = await api.get('/user/order');
        setOrders(data.orders);
      }catch(error){
        console.log(error.message);
      }finally{
        setLoading(false);
      }
    }
    fetchOrders()
  },[])

  if(loading)return <DotLoader/>
  return (
    <>
     <Header/>

     <div className="bg-[#fff5f7] p-4 pt-2 lg:hidden xl:hidden ">
        <div className="flex items-center justify-between -ml-2 mb-2">
          <button onClick={()=>navigate('/')}>
            <img className="h-3" src="/icons/leftArrow.png" alt="" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">History</h1>
          <div></div>
        </div>
     </div>

     <main 
      className={`px-5 flex flex-wrap lg:mt-25 ${orders.length < 1 ? "justify-center" : "justify-between" }`}>
      {
        orders.length < 1 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              No Orders Yet! 🍽️
            </h1>

            <p className="text-sm text-gray-500 max-w-xs">
              Looks like your plate is still empty.  
              Explore the menu and place your first order — delicious food awaits! 🍔🍕
            </p>
            <button className="bg-[#cd0045] mt-2 px-2 text-white text-sm font-semibold py-1 rounded-sm" onClick={()=>navigate('/')}>
              View Menu
            </button>
          </div>
        ) : (
            orders?.map(v =>(
            <OrderHistory data={v} />
          ))
        )
      }
     </main>
     <Nav />
    </>
  )
}