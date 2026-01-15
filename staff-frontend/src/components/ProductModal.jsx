import React, { useState } from 'react';
import { X, Upload, Clock, Tag, Leaf } from 'lucide-react';
import api from '../services/axios.js';
import uploadImageToCloudinary from '../services/cloudnary.js'

export default function ProductModal({ data, setShow, setData , fetchProducts , categories }) {
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState({});

  const [form, setForm] = useState({
    name: data?.name || "",
    image : data?.image || "",
    category: data?.category || "",
    price: data?.price || "",
    offer: data?.offer || "",
    prepTime: data?.prepTime || 5
  });

  const [toggle,setToggle] = useState({
    isBest: data?.isBest,
    isAvailable: data?.isAvailable,
    isSpecial: data?.isSpecial,
    isRemoved: data?.isRemoved,
    isVeg: data?.isVeg
  });

  const handleChange = (e)=>{
    setError(pre => ({...pre , [e.target.name] : null}));
    setForm(pre => {
      return (
        {...pre , [e.target.name] : e.target.value}
      )
    });
  }

  const validate = ()=>{
    const errorObj = {}
    if(!form.name?.trim().length){
      errorObj.name = "Name Required!"
    }
    if(!form.image){
      errorObj.image = "Image Required!"
    }
    if(!form.category || form.category.length === 0 ){
      errorObj.category = "Required!"
    }
    if(!form.price || form.price<=0){
      errorObj.price = "Invalid Price!"
    }

    if(!form.prepTime || form.prepTime<0){
      errorObj.prepTime = "Invalid Time!"
    }
    setError(errorObj);

    return Object.keys(errorObj).length === 0 ;
  }

  const handleToggle = (e)=>{
    setToggle(pre => {
      return (
        {...pre , [e.target.name] : e.target.checked}
      )
    });
  }

  const handleFile = async (e) => {
    try{
      const file = e.target.files[0];
      if (!file) return;
      setLoading(true);
      const url = await uploadImageToCloudinary(file);
      setError(pre => ({...pre, image: null})); // Clear image error on success
      setForm(pre =>{
        return (
          {...pre , image : url}
        )
      })
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }

  async function handleProduct() {
    if(!validate())return ;
    try{
      setLoading(true);
      if(data){
        await api.post(`/items/admin/${data._id}`,{...form,...toggle});
      }else{
        await api.post('/items/admin',{...form,...toggle});
      }
      setShow(false);
      setData(null);
      fetchProducts();
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }

  // Positioned specifically for your input heights
  const ErrorLabel = ({ message }) => (
    message ? <span className="absolute right-3 top-3.5 text-[9px] font-bold text-red-500 uppercase pointer-events-none">
      {message}
    </span> : null
  );

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => {
          setShow(false);
          setData(null);
        }}
      ></div>

      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            {data ? "Edit Product" : "Add Product"}
          </h1>
          <button 
            onClick={() => {
              setShow(false);
              setData(null);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8 scrollbar-hide">
          
          <div className="flex flex-row gap-6">
            <label className={`relative flex-shrink-0 w-32 h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-all group ${error.image ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-black/20'}`}>
              
              {
               loading ? (
                <span className="inline-block h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
               ) : 
               form.image ? (
                <>
                 <img src={form.image} name="image" alt="preview" className="w-full h-full object-cover rounded-2xl" />
                 <Upload size={24} className="text-gray-400 absolute top-1/2 -translate-y-1/2 group-hover:text-black transition-colors" />
                </>
              ) : (
                 <Upload size={24} className="text-gray-400 absolute top-1/2 -translate-y-1/2 group-hover:text-black transition-colors" />
              )}
              <input onChange={handleFile} type="file" className="hidden" />
              {/* Image Error Label specifically positioned for the box */}
              {error.image && <span className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 uppercase">{error.image}</span>}
            </label>

            <div className="flex-1 space-y-3">
              <div className="relative">
                <ErrorLabel message={error.name} />
                <input 
                  type="text" 
                  name="name"
                  onChange={handleChange}
                  defaultValue={form.name || ""}
                  placeholder="Product Name" 
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-gray-200 outline-none ${error.name ? 'border-red-200' : 'border-gray-200'}`}
                />
              </div>

              <div className="relative">
                <ErrorLabel message={error.category} />
                <select
                  name='category'
                  onChange={handleChange}
                  className={`w-full border bg-gray-50 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-gray-200 outline-none appearance-none ${error.category ? 'border-red-200' : 'border-gray-200'}`}
                >
                  <option value="">{form.category || "SELECT CATEGORY"}</option>
                  {
                    categories.map((v, i) =>(
                      <option key={i} value={v.name}>{v.name}</option>
                    ))
                  }
                </select>
              </div>

              <div className="relative">
                <ErrorLabel message={error.price} />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                <input 
                  type="text" 
                  name="price"
                  onChange={handleChange}
                  defaultValue={form.price}
                  placeholder="Price" 
                  className={`w-full bg-gray-50 border rounded-xl px-8 py-3 text-sm font-bold focus:ring-2 focus:ring-gray-200 outline-none text-gray-900 ${error.price ? 'border-red-200' : 'border-gray-200'}`}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1 flex-1 relative">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Current Offer</label>
              <div className="relative">
                <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  name="offer"
                  onChange={handleChange}
                  defaultValue={form.offer || ""}
                  placeholder="e.g. 20% OFF" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-10 py-3 text-sm font-semibold focus:ring-2 focus:ring-gray-200 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1 flex-1 relative">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Prep Time (Mins)</label>
              <ErrorLabel message={error.prepTime} />
              <div className="relative">
                <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="number" 
                  name="prepTime"
                  onChange={handleChange}
                  defaultValue={form.prepTime || 5}
                  className={`w-full bg-gray-50 border rounded-xl px-10 py-3 text-sm font-bold focus:ring-2 focus:ring-gray-200 outline-none ${error.prepTime ? 'border-red-200' : 'border-gray-200'}`}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-50" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ToggleItem onChange={handleToggle} name="isAvailable" toggle={toggle.isAvailable} label="Change Availability" sub="Visible on menu" />
            <ToggleItem onChange={handleToggle} name="isRemoved" toggle={toggle.isRemoved} label="Temporarily Remove" sub="Hide from shop" />
            <ToggleItem onChange={handleToggle} name="isBest" toggle={toggle.isBest} label="Best Selling Product" sub="Show badge" />
            <ToggleItem onChange={handleToggle} name="isSpecial" toggle={toggle.isSpecial} label="Today's Special" sub="Highlight item" />
            <ToggleItem onChange={handleToggle} name="isVeg" toggle={toggle.isVeg} label="Vegetarian" sub="Green mark indicator" />
          </div>

        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <button
           onClick={handleProduct}
           disabled={loading}
           className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 active:scale-[0.98] disabled:bg-gray-400">
            { loading ? (
              <span className="inline-block h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
             ) :
              data ? "Save Changes" : "Create Product"
            }
          </button>
        </div>

      </div>

    </div>
  );
}

function ToggleItem({ label, sub, toggle , name , onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-gray-800">{label}</p>
        <p className="text-[11px] text-gray-400 font-medium">{sub}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input onChange={onChange} name={name} defaultChecked={toggle} type="checkbox" className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
      </label>
    </div>
  );
}