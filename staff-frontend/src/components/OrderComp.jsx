export default function OrderComp() {
  const items = [
    { id: 1, name: "Margherita Pizza", qty: 2, img: "https://via.placeholder.com/50" },
    { id: 2, name: "Iced Americano", qty: 1, img: "https://via.placeholder.com/50" },
    { id: 1, name: "Margherita Pizza", qty: 2, img: "https://via.placeholder.com/50" },
    { id: 2, name: "Iced Americano", qty: 1, img: "https://via.placeholder.com/50" },
  ];

  return (
    <div className="max-w-xs min-w-xs float-left bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 m-4">

      <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="text-left">
          <p className="text-xs text-gray-500 uppercase font-bold ">Order ID</p>
          <p className="text-sm font-mono text-gray-600">#ORD-7721</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase font-bold ">Table</p>
          <p className="text-sm font-semibold text-gray-800">TBL-01</p>
        </div>
      </div>

      <div className="p-4 flex justify-between items-center bg-white">
        <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-gray-700 text-white">
          DINE-IN
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 uppercase">
          Accepted
        </span>
      </div>

      <hr className="mx-4" />

      <div className="p-4 space-y-4">
        {items.map((item,i) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div></div>
              <img 
                src={item.img} 
                alt={item.name} 
                className="w-12 h-12 rounded-lg object-cover bg-gray-100"
              />
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
              </div>
            </div>
            <div className="text-gray-600 font-medium">
              x{item.qty}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <button className="w-full bg-black/80 hover:bg-black text-white font-bold py-1.5 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer">
          Mark Preparing..
        </button>
      </div>

    </div>
  );
}