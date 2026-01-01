import api from "../services/axios";

export default function ProductComp({data,setSearch}) {

  async function changeAvailability() {
    try{
      const {data : itemData} = await api.get(`/items/cook/${data._id}?available=${!data.isAvailable}`);
      setSearch(pre => pre.map(product => product._id === itemData.item._id ? itemData.item : product));
      
    }catch(error){
      console.log(error.message)
    }
  }

  return (
    <div className="max-w-xs bg-white border border-gray-200 rounded-xl p-5 shadow-lg">
      <div className="flex justify-between gap-5 items-start mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{data.name}</h3>
          <span className="text-xs font-medium text-gray-400 uppercase">{data.category}</span>
        </div>
        
        <div className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-xl">
          {data.isAvailable ? "Available" : "Out Of Stock"}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm font-medium text-gray-600">Change Availability</div>
        
        <label onClick={changeAvailability} className="relative inline-flex items-center cursor-pointer">
          <input checked={data.isAvailable} type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
        </label>
      </div>
    </div>
  );
}