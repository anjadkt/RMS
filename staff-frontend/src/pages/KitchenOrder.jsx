import Header from "../components/Header";
import { useEffect,useState } from "react";
import OrderComp from "../components/OrderComp";

export default function KitchenOrders(){
  const [active,setActive] = useState("All");
  const filter = [
    "All","New","Preparing","Ready"
  ]
  return(
    <>
     <Header />
     
     <main className="mt-20 ml-18">
      <nav className="w-full gap-5 flex px-4 py-2">
      {
        filter.map((v,i)=>(
          <div
           onClick={()=>setActive(v)}
           key={i}
           className={`
              border px-2 py-1 border-gray-500 
              cursor-pointer
              
              rounded-lg text-sm font-semibold shadow-sm text-center
              ${active === v ? "bg-black text-white" : "hover:bg-gray-200"}
            `}
          >{v}</div>
        ))
      }
     </nav>
       <div>
        <OrderComp />
        <OrderComp />
        <OrderComp />
        <OrderComp />
        <OrderComp />
       </div>
     </main>
    </>
  )
}