export default function OrderHistory({ data }) {
   const statusColors = {
    placed: "bg-purple-100 text-purple-700",
    accepted: "bg-blue-100 text-blue-700",
    preparing: "bg-amber-100 text-amber-700",
    ready: "bg-green-100 text-green-700",
    served: "bg-emerald-100 text-emerald-700",
    pending : "bg-rose-100 text-rose-700",
    completed: "bg-slate-200 text-slate-700",
    default: "bg-slate-100 text-slate-600"
  };

  const total = data.orderItems.reduce(
    (accum, val) => accum + val.subTotal,
    0
  );

  return (
    <>
      <div
        key={data._id}
        className="bg-white w-[340px] border border-[#cd0045]  rounded-lg shadow-md mb-8 relative"
      >
        <div className="
        px-2 py-0 rounded-2xl 
        absolute -top-2 left-1/2 -translate-x-14 
        bg-gradient-to-b from-[#fff5f7] to-white">
          <div className="text-xs font-semibold text-[#cd0045] tracking-wide">
            {data.orderId}
          </div>
        </div>

        <div className="px-4 py-2 text-xs text-gray-600 flex justify-between mt-2 border-b border-gray-300">
          <div>
            <span className="font-semibold text-gray-700">Table Number :</span>{" "}
            {data.tableNumber}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Order Type :</span>{" "}
            {data.orderType}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {data.orderItems?.map((v, i) => (
            <div
              key={v.itemId}
              className="flex items-center justify-between px-4 py-2"
            >
              <div className="bg-gray-100 p-2 rounded-md w-[50px] flex items-center justify-center">
                <img
                  className="h-8 object-contain"
                  src={v.image}
                  alt={v.name}
                />
              </div>

              <div className="flex items-center gap-2 font-[REM] text-xs text-gray-600">
                <span className="font-medium">{v.name}</span>
                <span className="text-gray-500">x</span>
                <span className="font-medium">{v.quantity}</span>
              </div>

              <div className="text-xs font-medium text-gray-700">
                ₹{v.subTotal}
              </div>
            </div>
          ))}

          <div className="flex justify-between px-5 py-2 bg-gray-50">
            <span className="text-sm font-semibold text-gray-700">
              Total
            </span>
            <span className="text-sm font-bold text-gray-900">
              ₹{total}
            </span>
          </div>
        </div>

        <div className="flex font-[REM] justify-center px-4 py-2 border-t border-gray-100">
          <span
            className={`text-sm font-semibold px-10 py-0.5 rounded-lg
              ${statusColors[data.status]}`}
          >
            {data.status}
          </span>
        </div>
      </div>
    </>
  );
}