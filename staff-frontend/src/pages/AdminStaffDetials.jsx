import { useState, useEffect } from "react";
import { useParams , useNavigate } from 'react-router-dom'
import AdminHeader from "../components/AdminHeader";
import { User, Phone, MapPin, ShieldCheck, ShieldAlert, Table, ShoppingBag, Trash2, PlusCircle, CheckCircle2 } from "lucide-react";
import api from "../services/axios";

export default function AdminStaffDetails() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false); 
  const [selectedTables, setSelectedTables] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

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

  async function fetchUserData() {
    try {
      setLoading(true);
      const { data: userData } = await api.get(`/staff/admin/${id}`);
      setData(userData);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchUserData();
  }, [id]);

  const toggleTableSelection = (tableId) => {
    if (selectedTables.includes(tableId)) {
      setSelectedTables(selectedTables.filter(t => t !== tableId));
    } else {
      setSelectedTables([...selectedTables, tableId]);
    }
  };

  const manageTables = async (waiterId="")=>{
    try{
      setLoading(true);
      const {data} = await api.post('/table/admin/add',{tableNumber : selectedTables,waiterId});
      fetchUserData();
    }catch(error){
      console.log(error.message);
    }finally{
      setLoading(false);
    }
  }

  const manageUser = async (userDetails) =>{
    try {
      const {data} = await api.post('/staff/admin/manage',userDetails);
      fetchUserData();
    } catch (error) {
      console.log(error.message);
    }
  }

  const removeStaff = async (id) => {
    try{
      await api.delete(`/staff/admin/${id}`);
      navigate('/admin/users/staffs');
    }catch(error){
      console.log(error.message);
    }
  }

  return (
    <>
      <AdminHeader />
      <main className="pt-24 pb-10 px-10 bg-gray-50/50 min-h-screen ">
        
        <div className="flex flex-wrap gap-6 mb-8">

          <div className="relative w-sm bg-white border border-gray-100 rounded-xl p-8 shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0">
              {data.user?.isWorking ? (
                <div className="bg-green-700 text-white px-4 py-1.5 rounded-bl-2xl flex items-center gap-2">
                  <ShieldCheck size={16} strokeWidth={3} />
                  <span className="text-xs font-black uppercase tracking-widest">Verified</span>
                </div>
              ) : (
                <div className="bg-red-600 text-white px-4 py-1.5 rounded-bl-2xl flex items-center gap-2 shadow-sm">
                  <ShieldAlert size={16} strokeWidth={3} />
                  <span className="text-xs font-black uppercase tracking-widest">Unverified</span>
                </div>
              )}
            </div>

            <div className="flex gap-8 items-start mb-4">
              <div className="w-32 h-32 rounded-xl bg-gray-50 border-2 border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                {data.user?.photo ? <img src={data.user.photo} alt="userPhoto" className="w-full h-full object-cover" /> : <User size={48} className="text-gray-300" />}
              </div>
              <div className="flex flex-col gap-2 w-full">
                <h1 className="text-xl font-black text-gray-900 leading-tight">{data.user?.name}</h1>
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest"><span className="text-black">Role :</span> {data.user?.role}</p>
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest"><span className="text-black">Staff ID :</span> {data.user?.staffId}</p>
                <div className="flex items-center gap-1">
                  <Phone size={12} className="text-black" />
                  <span className="text-sm text-gray-400 font-semibold">+91 {data.user?.number}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-1">
                <MapPin size={18} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-600">{data.user?.address}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-between">
              <button
               onClick={()=>removeStaff(data.user._id)}
               className={`px-6 py-2.5 hover:bg-red-50 hover:text-red-600 bg-red-600 text-white cursor-pointer font-bold rounded-xl transition-all text-sm`}>
                Remove Staff
              </button>
              <button
               onClick={()=>manageUser({role : data.user?.role , id : data.user?._id , action : !data.user?.isWorking})}
               className={`px-6 py-2.5 ${data.user?.isWorking ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white" : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"} cursor-pointer font-bold rounded-xl transition-all text-sm`}>
                {data.user?.isWorking ? "Deactivate Staff" : "Activate Staff"}
              </button>
            </div>
          </div>

          <div className="bg-white border relative border-gray-100 rounded-xl p-6 shadow-sm flex flex-col w-2xl min-h-[350px]">
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-2">
                <Table size={20} className="text-gray-400" />
                <h2 className="font-black text-gray-900 uppercase text-sm tracking-wider">Assigned Tables ({data.tables?.length || 0})</h2>
              </div>
              <button 
                onClick={() => {
                  setShowAssignModal(!showAssignModal)
                  setSelectedTables([]);
                }}
                className="flex cursor-pointer items-center justify-center gap-2 py-2 px-8 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all text-xs"
              >
                {showAssignModal ? "Close" : <><PlusCircle size={14} /> Assign Tables</>}
              </button>
            </div>

            {!showAssignModal && (
              <div className={`flex flex-wrap gap-3 mb-6 ${loading ? "justify-center py-15" : ""} `}>
                {
                  loading ? (
                    <div className="inline-block h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) :
                  data.tables?.map((v, i) => {
                    const isSelected = selectedTables.includes(v._id);

                    return (
                      <div 
                        key={i} 
                        onClick={() => toggleTableSelection(v._id)}
                        className={`relative rounded-xl flex items-center h-14 justify-center text-xs py-4 px-8 font-black border-2 transition-all cursor-pointer 
                          ${isSelected ? "bg-black border-black text-white scale-105" : "bg-green-50 border-green-200 text-green-600 hover:border-green-300"}`}
                        >
                        {isSelected && <CheckCircle2 size={12} className="absolute -top-1.5 -right-1.5 text-black bg-white rounded-full" />}
                        {v.tableNumber}
                      </div>
                    );
                  })}
              </div>
            )}

            {showAssignModal && (
              <div className="absolute top-16 left-0 right-0 z-20 bg-white border border-gray-200 shadow-2xl rounded-2xl p-6 m-2 animate-in slide-in-from-top-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Select Tables to Add</p>
                <div className={`flex flex-wrap gap-4 mb-6 max-h-60 ${loading ? "justify-center py-4" : ""} overflow-y-auto pr-2 p-4`}>
                  {
                    loading ? (
                      <div className="inline-block h-8 w-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) :                   
                   data.allTables?.map((v, i) => {
                    const isSelected = selectedTables.includes(v._id);
                    const isAlreadyAssigned = v.waiterId; 

                    return (
                      <div 
                        key={i} 
                        onClick={() => toggleTableSelection(v._id)}
                        className={`relative rounded-xl flex items-center h-14 justify-center text-xs py-4 px-8 font-black border-2 transition-all cursor-pointer 
                          ${isAlreadyAssigned ? "bg-red-50 border-red-100 text-red-300 cursor-not-allowed opacity-60" : 
                            isSelected ? "bg-black border-black text-white scale-105" : "bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-300"}`}
                        >
                        {isSelected && <CheckCircle2 size={12} className="absolute -top-1.5 -right-1.5 text-black bg-white rounded-full" />}
                        {v.tableNumber}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                    <span className="text-xs font-bold text-gray-500">{selectedTables.length} Tables Selected</span>
                    <button
                     onClick={()=>manageTables(id)}
                     className="flex cursor-pointer items-center justify-center gap-2 py-2.5 px-10 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all text-xs">
                      Confirm Assignment
                    </button>
                </div>
              </div>
            )}

            {!showAssignModal && (
              <div className="mt-auto flex justify-end gap-3">
                <button
                 onClick={()=>manageTables("")}
                 className="flex cursor-pointer items-center justify-center gap-2 py-2 px-10 border border-gray-100 text-gray-500 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 transition-all text-xs">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
           <ShoppingBag size={24} className="text-gray-900" />
           <h1 className="text-xl font-black text-gray-900 tracking-tight">Current Orders</h1>
        </div>

        <div className="bg-white w-full max-w-4xl border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">No</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Items Count</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.orders?.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-5 text-sm font-bold text-gray-300">0{idx + 1}</td>
                  <td className="px-6 py-5 text-sm font-black text-gray-900">#{order.orderId}</td>
                  <td className="px-6 py-5 text-sm font-semibold text-gray-600 text-center">{order.orderItems?.length} Items</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 ${statusColors[order.status]} rounded-full text-[10px] font-black uppercase tracking-tighter`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-gray-900 text-right">₹{order.orderTotal}.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </>
  );
}