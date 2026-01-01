import Header from "../components/Header";
import {useState , useEffect} from 'react'
import ProductComp from "../components/productComp";
import api from "../services/axios";

export default function KitchenProducts(){
  const [search,setSearch] = useState([]);
  const [loading,setLoading] = useState(false);
  async function searchItem(e){
    try{
      setLoading(true);
      const {data} = await api.get(`/items?q=${e?.target.value || ""}`);
      setSearch(data);
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    searchItem();
  },[])
  
  return(
    <>
     <Header/>
     <nav className="mt-20 flex justify-center">
      <input
        type="text"
        onChange={searchItem}
        placeholder="Search Products..."
        className={`w-[380px] pl-5 border border-gray-400 pr-4 py-2 rounded-md text-sm outline-none bg-white shadow-lg`}
      />
     </nav>

     <main className="flex flex-wrap justify-center gap-5 mt-5 mb-20">
      {
        loading ? (
          <div className="flex mt-40 justify-center">
            <span className="inline-block h-8 w-8 border-3 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          search.map(v => (
            <ProductComp setSearch={setSearch} data={v} />
          ))
        )
      }
      
     </main>

    </>
  )
}