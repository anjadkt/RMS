import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import api from "../services/axios";
import TableOrder from "../components/tableOrder";
import { ChevronDown, ChevronUp } from "lucide-react";
import Bill from "../components/Bill";

export default function EachTable(){
  const [fall,setFall] = useState(false);
  const [drop,setDrop] = useState([]);

  const [loading,setLoading] = useState(false);
  const [orders,setOrders] = useState([]);
  const [table,setTables] = useState({});
  const [orderIds,setOrderId] = useState([]);
  const [error,setError] = useState({});
  const [billData,setBillData] = useState({});

  const {id} = useParams();

  const toggleCustomer = (index) => {
    setDrop((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index) 
        : [...prev, index]           
    );
  };

  async function generateBill() {
    try{
      setLoading(true);
      const {data} = await api.post('/waiter/orders/bill',{orderIds,tableId : table._id});
      setError({});
      setFall(!fall)
      setBillData(data.billData);
    }catch(error){
      if(error.status === 400)setError({data : "Select an Order!"});
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    async function fetchDetails() {
      try{
        setLoading(true);
        const {data} = await api.get(`/waiter/table/${id}`);
        setTables(data.table);
        setOrders(data.orders);
      }catch(error){
        console.log(error.message);
      }finally{
        setLoading(false);
      }
    }
    fetchDetails();
  },[])
  return (
    <>

    <header className="flex items-center justify-between bg-white border-b border-slate-100 
      px-4 py-1 
      lg:px-10 lg:py-6">
      
      <div className="flex items-center gap-3 lg:gap-6">
        <button 
          onClick={() => window.history.back()}
          className="p-2 -ml-2 rounded-full"
        >
          <img 
            src="/icons/leftArrow.png" 
            alt="back" 
            className="w-5 h-5 lg:w-8 lg:h-8 object-contain"
          />
        </button>
        
        <h1 className="text-sm lg:text-xl font-bold text-gray-500 ">
          Table <span className="text-slate-800">{table.tableNumber || "..."}</span>
        </h1>
      </div>

      <div className="flex items-center">
        <div className="bg-slate-100 text-slate-600 px-3 py-1 lg:px-5 lg:py-2 rounded-full 
          text-xs lg:text-base font-semibold tracking-wide shadow-sm border border-slate-200/50">
          {table.tableOrders?.length || 0} Orders
        </div>
      </div>
    </header>

    <main className="px-4 mt-4 flex flex-col items-center">
      {
        loading ? (
          <span className="h-6 w-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
        ) : 
        (
          orders.map((v,i) =>(
          <>
            <div 
              onClick={()=>toggleCustomer(i)}
              className="flex items-center justify-between font-bold text-gray-800 text-sm border border-black/30 rounded-lg max-w-2xl w-full px-2 py-2 mb-2 trasition-all duration-300">
              <div>Customer {i+1}</div>
              <div>{drop.includes(i) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>
            </div>
            <div>
              {
                drop.includes(i) && v.orders?.map(order => (
                  <TableOrder setOrderId={setOrderId} data={order} />
                ))
              }
            </div>
          </>
          ))
        )
      }

      <div className="my-2">
         <button 
          onClick={()=>generateBill()}
          className="border border-gray-600 px-4 py-1 text-sm rounded-sm font-semibold bg-black/80 text-white">Generate Bill</button>
         <div className="text-xs my-2 text-center font-medium text-red-500">{error.data || ""}</div>
      </div>

      <div 
        onClick={()=>setFall(!fall)}
        className="flex items-center justify-between font-bold text-gray-800 text-sm border border-black/30 rounded-lg max-w-2xl w-full px-2 py-2 mb-2 trasition-all duration-300">
        <div>View Bill</div>
        <div>{fall ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>
      </div>

      <div>
        {
          fall ? (
            Object.keys(billData).length ? (
            <Bill restaurantInfo={billData.restaurantInfo} billInfo={billData.billInfo} orderDetails={billData.orderDetails} billSummary={billData.billSummary}/>
          ) : <div>No Bill Generated!</div>
          
          ) : <div></div>
        }
      </div>

    </main>
     
    </>
  )
}