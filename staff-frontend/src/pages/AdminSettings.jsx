import { Tag, Search, Plus, Trash2, Image as ImageIcon, Link as LinkIcon, Star, Store, Clock, Mail, Phone, MapPin, Power, Save, Upload } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { useState } from "react";
import OfferCard from '../components/OfferCard.jsx'
import uploadImageToCloudinary from '../services/cloudnary.js'
import api from '../services/axios.js'
import { useEffect } from "react";

export default function AdminSettings() {
  const [productQuery, setProductQuery] = useState("");
  const [search,setSearch] = useState([]);
  const [settings,setSettings] = useState({});
  const [loading,setLoading] = useState(false);

  const [form,setForm] = useState({
    title : "",
    product : "",
    offer : "",
    productData : {},

    logo : "",
    email :"",
    phone : "",
    location : "",
    restaurentTimes :""
  });

  const inputs = [
    { label: "Restaurant Timings", icon: <Clock size={12}/>, placeholder: settings.restaurentTimes , name :"restaurentTimes" },
    { label: "Contact Email", icon: <Mail size={12}/>, placeholder: settings.email , name :"email" },
    { label: "Contact Number", icon: <Phone size={12}/>, placeholder: settings.phone , name :"phone" },
    { label: "Location Address", icon: <MapPin size={12}/>, placeholder: settings.location ,name :"location" }
  ]

  const handleChange = (e)=>{
      setForm(pre => (
        {...pre , [e.target.name] : e.target.value }
      )
    )
  }

  const handleFile = async (e) => {
    try{
      const file = e.target.files[0];
      if (!file) return;
      const url = await uploadImageToCloudinary(file);
      setForm(pre =>{
        return (
          {...pre , [e.target.name] : url}
        )
      })
    }catch(error){
      console.log(error.message);
    }
  }

  async function searchItem(e){
    setProductQuery(e.target.value);
    if(!e.target.value)return setSearch([]);

    try{
      const {data} = await api.get(`/items?q=${e.target.value}`);
      setSearch(data);
    }catch(error){
      console.log(error.message);
    }
  }

  const setProduct = (productData)=>{
    setProductQuery("");
    setForm(pre => (
        {...pre , productData , product : productData._id  }
      )
    )
  }

  const setOffer = async (isMain = false) => {
    try{
      setLoading(true);
      const {data} = await api.post('/resto/admin/offer',{...form , isMain});
      getRestoDetails();
      setForm({
        title : "",
        product : "",
        offer : "",
        productData : {}
      });
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }

  const getRestoDetails = async () => {
    try{
      setLoading(true);
      const {data} = await api.get('/resto?settings=true');
      setSettings(data.settings);
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }

  const removeOffer = async (id)=>{
    try{
      const {data} = await api.delete(`/resto/admin/offer/${id}`);
      getRestoDetails();
    }catch(error){
      console.log(error.message);
    }finally{

    }
  }

  const updateResto = async () => {
    try{
      setLoading(true);
      const {data} = await api.post(`/resto/admin`,{...form , status : settings.status === "open" ? "closed" : "open"});
      getRestoDetails();
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    getRestoDetails();
  },[]);

  if(loading)return (
    <div className="flex justify-center mt-10">
      <span className="inline-block text-center h-6 w-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <>
      <AdminHeader />

      <main className="pt-24 pb-10 px-10 ml-24 bg-gray-50/50 min-h-screen">
          
        <div className="flex flex-col lg:flex-row gap-8">

          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm h-full">
              <h2 className="text-xl font-black text-gray-900 tracking-tight mb-4">Create Offer</h2>

              <div className="space-y-5">

                <div className="relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Offer Title</label>
                  <div>
                    <input 
                      type="text"
                      value={form.title} 
                      onChange={handleChange}
                      name = "title"
                      placeholder="Enter Title" 
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="group relative h-40 w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center transition-colors hover:bg-gray-100 cursor-pointer overflow-hidden">
                  {
                    form.offer ? (
                      <img src={form.offer} alt={form.title} />
                    ) : (
                      <>
                        <ImageIcon className="text-gray-300 mb-2" size={32} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Select Image</span>
                      </>
                    )
                    
                  }
                  <input name="offer" onChange={handleFile} type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>

                <div className="relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Link Product</label>
                  <div className="relative mt-1.5">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      value = {productQuery}
                      onChange={searchItem} 
                      placeholder="Search items..." 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-9 pr-4 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none transition-all" 
                    />
                  </div>

                  {productQuery && (
                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                      {search.map((item) => (
                        <div onClick={() => setProduct(item)}  key={item._id} className="p-2 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group/item">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
                              <img src={item.image} alt="product" className="w-full h-full object-cover" />
                            </div>
                            <p className="text-xs font-black text-gray-800">{item.name}</p>
                          </div>
                          <button 
                            className="p-1.5 bg-gray-100 text-gray-400 rounded-lg group-hover/item:bg-black group-hover/item:text-white transition-all cursor-pointer"
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {
                    form.productData.image ? (
                      <div className="p-2 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group/item">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
                            <img src={form.productData?.image} alt="product" className="w-full h-full object-cover" />
                          </div>
                          <p className="text-xs font-black text-gray-800">{form.productData?.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )
                  }

                  
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={()=>setOffer(false)} className="w-full bg-black text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg active:scale-95 cursor-pointer">
                    Add Normal
                  </button>
                  <button onClick={()=>setOffer(true)} className="w-full bg-gray-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 cursor-pointer">
                    Set as Main
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100"><Tag size={20} className="text-gray-600" /></div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Active Offers</h2>
            </div>
            <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {
                settings.offers?.map((v,i)=>(
                  <OfferCard removeOffer={removeOffer} data={v} />
                ))
               }
              </div>
            </div>
          </section>

        </div>

        <section className="space-y-6 pt-10 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100"><Store size={20} className="text-rose-600" /></div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Restaurant Configuration</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Business Info Form */}
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-6 pb-8 border-b border-gray-50 mb-8">
                <div className="relative group w-20 h-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                  {
                    settings.logo ? (
                      <img src={form.logo || settings.logo} alt="" />
                    ) : (
                      <Upload size={18} className="text-gray-300 group-hover:text-black transition-colors" />
                    )
                  }
                  <input onChange={handleFile} name="logo" type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Update Logo</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">PNG or SVG • Max 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {inputs.map((field, i) => (
                  <div key={i} className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{field.icon} {field.label}</label>
                    <input defaultValue={field.placeholder} onChange={handleChange} name={field.name} type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-black/5 outline-none transition-all" />
                  </div>
                ))}
              </div>

              <button onClick={updateResto} className="flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all cursor-pointer">
                <Save size={16} /> Save Changes
              </button>
            </div>

            <div className={`${status === 'open' ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'} border rounded-3xl p-8 flex flex-col justify-between`}>
              <div>
                <h3 className={`text-lg font-black mb-2 ${status === 'open' ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {settings.status === 'open' ? 'Shutdown Store' : 'Open Store'}
                </h3>
                <p className={`text-xs font-bold leading-relaxed mb-6 ${status === 'open' ? 'text-rose-800/60' : 'text-emerald-800/60'}`}>
                  {settings.status === 'open' 
                    ? 'Closing the restaurant will immediately stop all incoming orders from the customer application.' 
                    : 'Opening the restaurant will allow customers to browse your menu and place new orders.'}
                </p>
                
                <div className={`p-4 bg-white/60 border rounded-2xl flex items-center justify-between ${settings.status === 'open' ? 'border-rose-200' : 'border-emerald-200'}`}>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${settings.status === 'open' ? 'text-rose-900' : 'text-emerald-900'}`}>
                    Status
                  </span>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full animate-pulse ${settings.status === 'open' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className={`text-xs font-black uppercase ${settings.status === 'open' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {settings.status}
                    </span>
                  </div>
                </div>
              </div>

              <button onClick={updateResto} className={`mt-8 w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 cursor-pointer shadow-lg 
                ${settings.status === 'open' 
                  ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'}`}>
                {settings.status === 'open' ? (
                  <>
                    <Power size={18} strokeWidth={3} /> Close Restaurant
                  </>
                ) : (
                  <>
                    <Store size={18} strokeWidth={3} /> Open Restaurant
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

      </main>

    </>
  );
}