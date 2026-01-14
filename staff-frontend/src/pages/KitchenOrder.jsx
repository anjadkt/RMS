import Header from "../components/Header";
import { useEffect,useState ,useRef} from "react";
import OrderComp from "../components/OrderComp";
import { useSelector , useDispatch } from "react-redux";
import { fetchKitchenOrders } from "../app/features/order/orderSlice";

export default function KitchenOrders(){
  const [active,setActive] = useState("all");
  const {orders,loading} = useSelector(state => state.orders);

  const dispatch = useDispatch();

  const filter = [
    {cover : "All" , value :"all" },
    {cover : "New" , value :"accepted" },
    {cover : "Preparing" , value :"preparing" },
    {cover : "Ready" , value :"ready" }
  ]

  useEffect(()=>{
    dispatch(fetchKitchenOrders(active));
  },[active]);

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
            setActive(v.value);
           }}
           key={i}
           className={`
              border px-2 py-1
              cursor-pointer
              border-r border-gray-500 
              rounded-lg text-sm font-semibold shadow-sm text-center
              ${active === v.value ? "bg-black text-white" : "hover:bg-gray-200"}
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
                <OrderComp data={v} />
              ))
            }
          </main>
        )
      }
     
    </>
  )
}