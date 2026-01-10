import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import api from "../services/axios";

export default function Category() {
  const navigate = useNavigate();
  const [categories,setCategories] = useState([]);
  
   async function fetchCategory(){
    try{
      const {data} = await api.get('/resto?categories=true');
      setCategories(data.categories);
    }catch(erro){}
  }

  useEffect(()=>{
    fetchCategory();
  },[])

  return (
    <div className="mt-4 mb-12 py-4 flex gap-6 overflow-x-auto scrollbar-hide px-4 lg:px-20">
      {categories.map((cat, i) => (
        <div 
          onClick={() => navigate(`/items/${cat.name}`)}
          key={i}
          className="group flex flex-col items-center gap-3 min-w-[90px] cursor-pointer"
        >
          <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center shadow-sm group-hover:border-[#cd0045] group-hover:shadow-rose-100 transition-all">
            <img className="h-10 lg:h-12 object-contain group-hover:scale-110 transition-transform" src={cat.img} alt={cat.name} />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest text-center ${cat.name === "Show All" ? "text-rose-600" : "text-slate-500 group-hover:text-slate-900"}`}>
            {cat.name}
          </span>
        </div>
      ))}
      <div 
        className="group flex flex-col items-center gap-3 min-w-[90px] cursor-pointer"
      >
        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center shadow-sm group-hover:border-[#cd0045] group-hover:shadow-rose-100 transition-all">
          <img className="h-10 lg:h-12 object-contain group-hover:scale-110 transition-transform" src='/icons/serve.png' />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest text-center text-rose-600`}>
          Show All
        </span>
      </div>
    </div>
  );
}