import { useNavigate } from "react-router-dom";

export default function TableComp({ data }) {
  const navigate = useNavigate();
  const stats = [
    { label: "New", symbol : "placed", color: "text-purple-700" },
    { label: "Ready", symbol : "ready", color: "text-green-700" },
    { label: "Served", symbol : "served", color: "text-emerald-700" },
    { label: "Pending", symbol : "pending", color: "text-rose-700" }
  ];

  const status = {}

  for(let v of data.tableOrders){
    if(status[v.status]){
      status[v.status]++
    }else{
      status[v.status] = 1
    }
  }

  return (
    <div className={`
      ${status.pending > 0 ? 
        "bg-rose-100 border border-rose-700" : 
        "bg-white border border-slate-200"}

      h-24 flex flex-col justify-between rounded-2xl shadow-sm
       w-[90px] py-2
      lg:py-4 lg:w-50 lg:flex lg:flex-col lg:rounded-xl`}
      onClick={()=>navigate(`/waiter/tables/${data._id}`)}
    >
      
      <div className="flex items-center justify-center mb-3 lg:mb-0">
        <span className="text-[12px] font-bold text-black/80 uppercase">
          {data.tableNumber}
        </span>
      </div>

      <div className="flex flex-wrap justify-center">
        {stats.map((item, index) => (
          status[item.symbol] ? (
            <div 
              key={index} 
              className="flex flex-col w-10 items-center justify-center rounded-xl 
              lg:px-4 "
            >
              <div className={`text-xs border px-1.5 shadow-2xl rounded-2xl font-black ${item.color}`}>
                {status[item.symbol]}
              </div>
              <div className="text-[8px]  font-bold text-slate-500 uppercase">
                {item.label}
              </div>
            </div>
          ) : <div></div>
        ))}
      </div>
    </div>
  );
}