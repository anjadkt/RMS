import { useEffect, useState } from 'react';
import AdminHeader from '../components/AdminHeader.jsx'
import { Search, Plus, Edit, Trash2, MoreVertical } from 'lucide-react'
import ProductModal from "../components/ProductModal.jsx"
import api from '../services/axios.js';

export default function AdminProducts() {

  const [show,setShow] = useState(false);
  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(false);
  const [products,setProducts] = useState([]);
  const [categories,setCategories] = useState([]);
  const [form , setForm] = useState({
    q : "",
    category : "all"
  });

  async function fetchProducts() {
    try {
      setLoading(true);
      const {data} = await api.get(`items?q=${form.q}&category=${form.category === "all" ? "" : form.category}&role=admin`);
      setProducts(data);
    } catch (error) {
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }

  async function deleteProduct(id) {
    try{
      await api.delete(`items/admin/${id}`);
      fetchProducts();
    }catch(error){
      console.log(error.message);
    }
  }

  async function fetchCategory(){
    try{
      const {data} = await api.get('/resto?categories=true');
      setCategories(data.categories);
    }catch(erro){}
  }

  useEffect(()=>{
    fetchCategory();
  },[])

  useEffect(()=>{
    fetchProducts();
  },[form]);

  return (
    <>
      <AdminHeader />

      <div className="fixed top-26 left-2 flex flex-col items-start gap-2 bg-white z-40">
        <button
         className={`flex items-center px-2 cursor-pointer justify-center gap-3 w-full text-sm font-bold py-2 px-2 rounded-sm bg-black/80 text-white shadow-lg transition-all`}>
          Products
        </button>
      </div>

      <main className="pt-24 pb-10 px-6 ml-24 bg-gray-50/50 min-h-screen">
        
        <div className="flex justify-between items-end gap-6 mb-5">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Products</h1>
            <p className="text-gray-500 text-sm mt-1">Add, edit or remove products from your webiste</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400 group-focus-within:text-gray-600 transition-colors" />
              </div>
              <input 
                type="text" 
                onChange={(e)=>setForm(pre => (
                  {...pre , q : e.target.value}
                ))}
                placeholder='Search Products...' 
                className="w-full text-gray-600 font-medium bg-white border border-gray-200 py-2.5 pl-10 pr-6 rounded-xl outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
              />
            </div>

            <button
             onClick={()=>setShow(true)}
             className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all cursor-pointer shadow-md shadow-black/10 active:scale-95">
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>

         <div className="
           flex items-start gap-2 mb-4 overflow-x-auto scrollbar-hidden
           sticky top-15 px-3 py-2 rounded-xl bg-white
          ">
              <button 
                className={`whitespace-nowrap px-3 py-0.5  rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border cursor-pointer bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black`}
              >
                <Plus size={22}/>
              </button>
              <button 
                onClick={()=>setForm(pre => (
                  {...pre , category : "all"}
                ))}
                className={`whitespace-nowrap px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border
                cursor-pointer
                ${"all" === form.category
                  ? 'bg-black text-white border-black shadow-md' 
                  : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'}`}
              >
                all
              </button>
            {categories.map((v, i) => (
              <button 
                key={i}
                onClick={()=>setForm(pre => (
                  {...pre , category : v.name}
                ))}
                className={`whitespace-nowrap px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border
                cursor-pointer
                ${v.name === form.category
                  ? 'bg-black text-white border-black shadow-md' 
                  : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'}`}
              >
                {v.name}
              </button>
            ))}
          </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
              </tr>

            </thead>
            <tbody className="divide-y divide-gray-100">
              {
                loading ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center">
                      <div className="inline-block h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <span className="text-sm font-bold text-gray-600">
                          No products found
                        </span>
                        <span className="text-xs">
                          Add a product to see it here
                        </span>
                      </div>
                    </td>
                  </tr>
                ): 
                products.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-800">{product.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-medium text-gray-700">
                        {product.isAvailable ? 'Available' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.isRemoved ? 'bg-red-500' :'bg-gray-500'}`}></div>
                      <span className="text-sm font-medium text-gray-700">
                        {product.isRemoved ? 'On Hold' : 'Not Hold'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-gray-900">₹{product.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                      onClick={()=>{
                        setData(product);
                        setShow(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer">
                        <Edit size={18} />
                      </button>
                      <button
                       onClick={()=>deleteProduct(product._id)}
                       className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
                
              }

            </tbody>
          </table>
          
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
            <p className="text-xs text-gray-400 font-medium">Showing {products.length} products</p>
          </div>
        </div>

      </main>

      {
        show ? (
          <ProductModal categories={categories} fetchProducts={fetchProducts} setData={setData} data={data} setShow={setShow}/>
        ) : (
          <></>
        )
      }

    </>
  )
}