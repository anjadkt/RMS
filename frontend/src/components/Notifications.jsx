import {useState,useEffect} from 'react'
import api from '../services/axios.js'
import { Bell, LogOut, User, X } from "lucide-react";


export default function Notifications({setShowNotifications}){
  const [notifications,setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchNoti(){
      try{
        setLoading(true);
        const {data} = await api.get('auth/user');
        setNotifications(data.userData.notification.reverse());
      }catch(error){
        console.log(error.message);
      }finally{
        setLoading(false);
      }
    };
  
    const deleteNotification = async(id) =>{
      try{
        setLoading(true);
        await api.get(`/user/order/notification/${id}`);
        fetchNoti();
      }catch(error){
        console.log(error.message);
      }finally{
        setLoading(false);
      }
    }
  
    useEffect(()=>{
      fetchNoti();
    },[])

  return (
    <>
      <div className="fixed inset-0 z-[-1]" onClick={() => setShowNotifications(false)}></div>
      <div className="absolute lg:right-0 -right-20 mt-4 lg:mt-2  w-2xs sm:w-80 bg-white border border-rose-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-rose-50 bg-rose-50/30 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-black">Notifications</h3>
          <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full">{notifications.length}</span>
        </div>

        <div className={`max-height-[400px] overflow-y-auto max-h-[70vh]`}>
          {
            notifications.length > 0 ? (
               
              notifications.map((n) => (
              <div key={n._id} className="p-4 border-b border-gray-50 flex justify-between gap-3 hover:bg-slate-50 transition-colors group">
                
                <div onClick={()=>navigate(n.link)} className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#cd0045] uppercase tracking-tight">From: {n.from}</span>
                  <p className="text-sm text-slate-600 font-medium leading-tight">{n.message}</p>
                </div>

                <div>
                  
                  <button 
                    onClick={()=>deleteNotification(n._id)}
                    className="text-slate-300 cursor-pointer hover:text-rose-500 transition-colors p-1"
                  >
                    <X size={16} />
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="p-8 text-center flex flex-col items-center gap-2">
              <Bell size={24} className="text-slate-200" />
              <p className="text-xs font-bold text-slate-400 uppercase">No new alerts</p>
            </div>
          )}
        </div>
        
      </div>
    </>
  )
}