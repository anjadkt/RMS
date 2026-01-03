import { useState , useEffect } from 'react';
import api from '../services/axios.js'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../app/features/user/userSlice.js';

export default function LoginPage () {
  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState(false);
  const [error,setError] = useState({});
  const [loading,setLoading] = useState(false);
  const [timer,setTimer] = useState(0);
  const [otpLoading,setOtpLoading] = useState(false);

  useEffect(()=>{
    if(timer === 0)return;

    const timeOut = setTimeout(()=>{
      setTimer(pre => pre-1);
    },1000);

    return () => clearTimeout(timeOut);
    
  },[timer])


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
    try{
      setLoading(true);
      if(isAdmin){
        const {data} = await api.post('/auth/admin/login',form);
        setError({});
        dispatch(checkAuth());
        navigate('/admin/dashboard');
      }else{
        const {data} = await api.post('/auth/staff/login',form);
        setError({});
        dispatch(checkAuth());
        navigate( data.role === "waiter" ? '/waiter/orders' : '/kitchen/orders');
      }
    }catch(error){
      switch(error.status){
        case 400 :
          setError({staffId : "Required!",pin : "Required!" , email :"Required", otp : "Required" , password : "Required"});
          break ;
        case 404 : 
          setError({staffId : "Mismatch!", email : "User Not Found!" });
          break;
        case 406 :
          setError({pin : "Wrong Pin!", password : "Wrong Password/otp",otp : "Wrong Password/otp"});
          break;
      }
    }finally{
      setLoading(false);
    }
  }

  const sendOtp = async () => {
    if(!form.email) return setError({email : "Required!"})
    try{
      setOtpLoading(true);
      const {data} = await api.post('/auth/admin/otp',{email : form.email});
      setTimer(30);
    }catch(error){
      if(error.status === 400){
        setError({
          email : "Required!"
        })
      }else if(error.status === 429){
        setError({
          common : "Too Many Requests!"
        })
      }
    }finally{
     setOtpLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-sans text-slate-900">
      <div className="bg-white rounded-xl shadow-2xl w-full lg:w-sm max-w-md overflow-hidden border border-slate-100">
        
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
              className="w-full cursor-pointer hover:bg-black flex items-center justify-center bg-black/90 text-white font-semibold py-2 rounded-xl shadow-lg mt-2">
                {loading ? (
                  <span className="inline-block h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ):"Authorize Staff"}
              </button>
            </form>
          ) : (
            <form 
            onSubmit={(e)=>{
              e.preventDefault();
              verifyUser();
            }}
            key="admin" className="space-y-5 ">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <input 
                    type="email" 
                    name='email'
                    onChange={handleChange}
                    value={error.email ? error.email : form.email}
                    placeholder={"admin@corp.com"} 
                    className={`w-full px-4 py-3  rounded-xl border border-black/20 focus:bg-white placeholder:text-slate-300 focus:border-black/50 outline-none transition-all ${error.email ? "text-red-400 bg-red-200" : " bg-slate-50"}`}
                  />
                  <button 
                   onClick={sendOtp}
                   disabled={timer}
                   type="button" className="absolute right-3 text-[12px] bg-indigo-50 text-black px-3 py-2 rounded-lg font-black hover:bg-gray-200 cursor-pointer transition-colors">
                    {otpLoading ? (
                      <span className="inline-block h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    )  : timer ? timer : "SEND OTP"}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">OTP</label>
                  <input 
                    type="text" 
                    name='otp'
                    value={error.otp ? error.otp : form.otp}
                    placeholder={"0000"}
                    onChange={handleChange}
                    className={`w-full px-4 py-2  rounded-xl border border-black/20 focus:bg-white placeholder:text-slate-300 focus:border-black/50 outline-none transition-all ${error.otp ? "text-red-400 bg-red-200" : "bg-slate-50"}`}
                  />
                </div>
                 <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Admin Pass</label>
                  <input 
                    type={error.password ? "text" : "password" }
                    name='password'
                    onChange={handleChange}
                    value = {error.password ? error.password : form.password}
                    placeholder={"••••"}
                    className={`w-full px-4 py-3  rounded-xl border border-black/20 focus:bg-white placeholder:text-slate-300 focus:border-black/50 outline-none transition-all ${error.password ? "text-red-400 bg-red-200" : "bg-slate-50"}`}
                  />
                </div>
              </div>

              <button type='submit' className="w-full bg-black/90 hover:bg-black cursor-pointer text-white font-bold py-2.5 rounded-2xl shadow-xl shadow-black-100 transition-all active:scale-[0.98] mt-2">
                {
                  loading ? (
                    <span className="inline-block h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin" />

                  ) : "Authorize Admin"
                }
              </button>
              {error.common && (
                <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error.common}
                </div>
              )}
           </form>
          )}
        </div>
      </div>
    </div>
  );
};