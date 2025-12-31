import { useState } from 'react';
import api from '../services/axios.js'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../app/features/user/userSlice.js';

export default function LoginPage () {
  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState(false);
  const [error,setError] = useState({});
  const [loading,setLoading] = useState(false);
  const [form , setForm] = useState({
    staffId : "",
    password : "",
    email : "",
    otp : "",
    pin : ""
  });
  const navigate = useNavigate();

  const handleChange = (e) =>{
    setError({});
    setForm(pre =>(
      {
        ...pre , [e.target.name] : e.target.value
      }
    ))
  }

  const verifyUser = async () =>{
    if(Object.keys(error).length>0)return ;
    if(!isAdmin){
      try{
        setLoading(true);
        const {data} = await api.post('/auth/staff/login',form);
        setError({});
        dispatch(checkAuth());
        navigate('/')
      }catch(error){
        switch(error.status){
          case 400 :
            setError({staffId : "Required!",pin : "Required!"});
            break ;
          case 404 : 
            setError({staffId : "Mismatch!"});
            break;
          case 406 :
            setError({pin : "Wrong Pin!"});
            break;
        }
      }finally{
        setLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-sans text-slate-900">
      <div className="bg-white rounded-xl shadow-2xl w-full lg:w-1/2 xl:w-1/2 max-w-md overflow-hidden border border-slate-100">
        
        <div className="py-4 text-center">
          <h1 className="text-xl font-black tracking-tight">
            {isAdmin ? 'Admin Portal' : 'Staff Portal'}
          </h1>
        </div>

        <div className="px-8 mb-8">
          <div className="bg-slate-100 p-1.5 rounded-2xl flex relative items-center">
            <div 
              className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-transform duration-300 ease-out ${
                isAdmin ? 'translate-x-full' : 'translate-x-0'
              }`}
            />
            
            <button 
              onClick={() => setIsAdmin(false)}
              className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors duration-300 ${!isAdmin ? 'text-black' : 'text-slate-500'}`}
            >
              Staff
            </button>
            <button 
              onClick={() => setIsAdmin(true)}
              className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors duration-300 ${!isAdmin ? 'text-slate-500' : 'text-black'}`}
            >
              Admin
            </button>
          </div>
        </div>

        <div className="px-10 pb-10">
          {!isAdmin ? (
            <form 
              key="staff" 
              className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
              onSubmit={(e)=>{
                e.preventDefault();
                verifyUser();
              }}
            >
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Staff ID</label>
                <input 
                  type="text" 
                  onChange={handleChange}
                  name = "staffId"
                  placeholder={error.staffId || "e.g. WTR-4432"}
                  className={`w-full px-5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border
                    ${error.staffId ? "outline-red-600 text-red-600" : "outline-gray-500"}
                    border-transparent outline-gray-500 outline-1  focus:outline-gray-800`}
                />
              </div>
              <div>
                <div className="flex justify-between mb-2 ml-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">PIN</label>
                  <button type="button" className="text-xs font-bold text-gray-500 hover:text-gray-800">Forgot PIN ?</button>
                </div>
                <input 
                  type="password" 
                  onChange={handleChange}
                  name='pin'
                  placeholder={error.pin || "••••••••"  }
                  className={`w-full px-5 py-2 text-xs font-semibold rounded-xl bg-slate-50
                    ${error.pin ? "outline-red-600 text-red-600" : "outline-gray-500"}
                    border border-transparent  outline-1  focus:outline-gray-800`}
                />
              </div>
              <button 
              className="w-full flex items-center justify-center bg-black/90 text-white font-semibold py-2 rounded-xl shadow-lg mt-2">
                {loading ? (
                  <span className="inline-block h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ):"Login"}
              </button>
            </form>
          ) : (
            <form key="admin" className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="admin@corp.com" 
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300"
                  />
                  <button type="button" className="absolute right-3 top-2 text-[10px] bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg font-black hover:bg-indigo-100 transition-colors">
                    SEND OTP
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">OTP</label>
                  <input 
                    type="text" 
                    placeholder="0000" 
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-center tracking-[0.5em] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Admin Pass</label>
                  <input 
                    type="password" 
                    placeholder="••••" 
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  />
                </div>
              </div>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] mt-2">
                Authorize Admin
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};