import Header from "../components/Header";
import { useEffect, useState } from "react";
import OrderComp from "../components/OrderComp";
import { useSelector, useDispatch } from "react-redux";
import { fetchKitchenOrders } from "../app/features/order/orderSlice";
import { Inbox } from "lucide-react"; // Optional: adding an icon for better UI

export default function KitchenOrders() {
  const [active, setActive] = useState("all");
  const { orders, loading } = useSelector((state) => state.orders);

  const dispatch = useDispatch();

  const filter = [
    { cover: "All", value: "all" },
    { cover: "New", value: "accepted" },
    { cover: "Preparing", value: "preparing" },
    { cover: "Ready", value: "ready" },
  ];

  useEffect(() => {
    dispatch(fetchKitchenOrders(active));
  }, [active]);

  return (
    <>
      <Header />

      <nav
        className="
      w-30 gap-6 flex flex-col justify-center
      px-4 py-2
      fixed top-0 left-0 bottom-0
      "
      >
        {filter.map((v, i) => (
          <div
            onClick={() => {
              setActive(v.value);
            }}
            key={i}
            className={`
              border px-2 py-1
              cursor-pointer
              border-r border-gray-500 
              rounded-lg text-sm font-semibold shadow-sm text-center
              transition-all
              ${active === v.value ? "bg-black text-white" : "hover:bg-gray-200"}
            `}
          >
            {v.cover}
          </div>
        ))}
      </nav>

      {loading ? (
        <div className="flex mt-50 justify-center">
          <span className="inline-block h-8 w-8 border-3 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <main className="mt-20 ml-34 flex flex-wrap justify-start min-h-[60vh]">
          {orders.length > 0 ? (
            orders.map((v) => <OrderComp key={v._id} data={v} />)
          ) : (
            <div className="w-full flex flex-col items-center justify-center mt-20 opacity-40">
              <Inbox size={48} strokeWidth={1} className="mb-2" />
              <h2 className="text-xl font-bold tracking-tight">No {active !== 'all' ? active : ''} orders</h2>
              <p className="text-sm font-medium">New orders will appear here automatically.</p>
            </div>
          )}
        </main>
      )}
    </>
  );
}