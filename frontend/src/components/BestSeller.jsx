import ItemButton from "./ItemButton";

export default function BestSeller({data}) {
  return (
    <div key={data._id} className=" relative w-[180px] ml-3 shrink-0 rounded-xl bg-white shadow-md border border-gray-100 hover:shadow-md transition xl:ml-5">
      
      <div className="h-36 w-full bg-gray-100 rounded-t-xl flex items-center justify-center">
        <img
          src={data?.image}
          alt={data?.name}
          className="h-32 object-contain"
        />
      </div>

      <div className="p-3 space-y-2">
        
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
          {data.name?.length > 10 ? data.name.slice(0,10) + "..." : data.name}
          </h3>
          <div>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              ⭐ {data.rating}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs font-bold text-green-700">
            <img className="h-3 mr-0.5" src="/icons/clock.png" alt="" />
            <div>12–15 mins</div>
          </div>

          <ItemButton cartItem={data} />
        </div>

      </div>

      <div className="text-sm font-semibold text-gray-800 absolute top-2 right-0 bg-white px-2 rounded-l-sm">
        ₹{data.price}
      </div>
    </div>
  );
}