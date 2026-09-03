import { useState, useEffect } from 'react';
import api from '../services/axios.js'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../app/features/user/userSlice.js';

export default function LoginPage() {
  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    if (timer === 0) return;
    const timeOut = setTimeout(() => {
      setTimer(pre => pre - 1);
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [timer])

  const [form, setForm] = useState({
    staffId: "",
    password: "",
    email: "",
    otp: "",
    pin: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    // Clear error for the specific field being typed in
    setError(prev => ({ ...prev, [e.target.name]: null }));
    setForm(pre => ({ ...pre, [e.target.name]: e.target.value }));
  }

  const validateFields = () => {
    const errorObj = {}

    if (!isAdmin) {
      if (form.staffId?.trim().length < 6) {
        errorObj.staffId = "Short ID"
      }

      // if (!form.staffId.includes("WTR-") && !form.staffId.includes("CHF-")) {
      //   errorObj.staffId = "Invalid Format"
      // }
      if (form.pin?.trim().length < 6) {
        errorObj.pin = "Min 6 digits"
      }
    } else {
      if (!form.email.includes("@")) {
        errorObj.email = "Invalid Email"
      }
      if (form.otp.trim().length < 6) {
        errorObj.otp = "6 Digits required"
      }
      if (form.password?.trim().length < 6) {
        errorObj.password = "Short password"
      }
    }

    setError(errorObj);
    return Object.keys(errorObj).length === 0;
  }

  const verifyUser = async () => {
    if (!validateFields()) return;
    try {
      setLoading(true);
      if (isAdmin) {
        const { data } = await api.post('/auth/admin/login', form);
        console.log(data);
        dispatch(checkAuth());
        navigate('/admin/dashboard');
      } else {
        const { data } = await api.post('/auth/staff/login', form);
        dispatch(checkAuth());
        navigate(data.role === "waiter" ? '/waiter/orders' : '/kitchen/orders');
      }
    } catch (err) {
      if (err.status === 400) setError({ common: "All fields required" });
      else if (err.status === 404) setError({ staffId: "Not Found", email: "Not Found" });
      else if (err.status === 406) setError({ pin: "Wrong Pin", password: "Wrong Pass", otp: "Wrong OTP" });
    } finally {
      setLoading(false);
    }
  }

  const sendOtp = async () => {
    if (!form.email) return setError({ email: "Required!" })
    try {
      setOtpLoading(true);
      await api.post('/auth/admin/otp', { email: form.email });
      setTimer(30);
    } catch (err) {
      setError({ email: err.status === 429 ? "Wait a moment" : "Failed" });
    } finally {
      setOtpLoading(false);
    }
  }

  // Reusable Error Component for the right side
  const ErrorLabel = ({ message }) => (
    message ? <span className="absolute right-0 top-2 text-[8px] font-bold text-red-500 uppercase tracking-tighter">
      {message}
    </span> : null
  );

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center p-6 font-sans text-slate-900">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100">

        <div className="py-6 text-center">
          <h1 className="text-2xl font-black tracking-tight">
            {isAdmin ? 'ADMIN ACCESS' : 'STAFF ACCESS'}
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="px-8 mb-6">
          <div className="bg-slate-100 p-1.5 rounded-2xl flex relative items-center">
            <div className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-transform duration-300 ease-out ${isAdmin ? 'translate-x-full' : 'translate-x-0'}`} />
            <button onClick={() => { setIsAdmin(false); setError({}) }} className={`relative z-10 flex-1 py-2 text-sm font-bold transition-colors ${!isAdmin ? 'text-black' : 'text-slate-400'}`}>Staff</button>
            <button onClick={() => { setIsAdmin(true); setError({}) }} className={`relative z-10 flex-1 py-2 text-sm font-bold transition-colors ${isAdmin ? 'text-black' : 'text-slate-400'}`}>Admin</button>
          </div>
        </div>

        <div className="px-10 pb-10">
          <form onSubmit={(e) => { e.preventDefault(); verifyUser(); }} className="space-y-4">
            {!isAdmin ? (
              <>
                <div className="relative flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Staff ID</label>
                  <ErrorLabel message={error.staffId} />
                  <input
                    type="text"
                    name="staffId"
                    value={form.staffId}
                    onChange={handleChange}
                    placeholder="WTR-0000"
                    className={`w-full px-4 py-3 text-sm font-bold rounded-2xl bg-slate-50 border-2 transition-all outline-none ${error.staffId ? "border-red-200 focus:border-red-400" : "border-transparent focus:border-black/10"}`}
                  />
                </div>

                <div className="relative flex flex-col">
                  <div className="flex justify-between mb-1 ml-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">PIN</label>
                  </div>
                  <ErrorLabel message={error.pin} />
                  <input
                    type="password"
                    name="pin"
                    value={form.pin}
                    onChange={handleChange}
                    placeholder="••••••"
                    className={`w-full px-4 py-3 text-sm font-bold rounded-2xl bg-slate-50 border-2 transition-all outline-none ${error.pin ? "border-red-200 focus:border-red-400" : "border-transparent focus:border-black/10"}`}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="relative flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Email</label>
                  <ErrorLabel message={error.email} />
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="admin@hotel.com"
                      className={`w-full px-4 py-3 text-sm font-bold rounded-2xl bg-slate-50 border-2 transition-all outline-none ${error.email ? "border-red-200" : "border-transparent focus:border-black/10"}`}
                    />
                    <button
                      onClick={sendOtp}
                      disabled={timer > 0 || otpLoading}
                      type="button"
                      className="absolute right-2 top-2 text-[10px] bg-gray-100 text-black px-3 py-1.5 rounded-xl font-bold hover:text-white cursor-pointer hover:bg-gray-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
                    >
                      {otpLoading ? (
                        <span className="inline-block text-center text-black h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : timer > 0 ? `${timer}s` : "OTP"}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 ml-1">OTP</label>
                    <ErrorLabel message={error.otp} />
                    <input
                      type="text"
                      name="otp"
                      value={form.otp}
                      onChange={handleChange}
                      placeholder="123456"
                      className={`w-full px-4 py-3 text-sm font-bold rounded-2xl bg-slate-50 border-2 transition-all outline-none ${error.otp ? "border-red-200" : "border-transparent focus:border-black/10"}`}
                    />
                  </div>
                  <div className="relative flex-1">
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Password</label>
                    <ErrorLabel message={error.password} />
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••"
                      className={`w-full px-4 py-3 text-sm font-bold rounded-2xl bg-slate-50 border-2 transition-all outline-none ${error.password ? "border-red-200" : "border-transparent focus:border-black/10"}`}
                    />
                  </div>
                </div>
              </>
            )}

            <button className="w-full bg-black cursor-pointer text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center">
              {loading ? <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "AUTHENTICATE"}
            </button>

            {error.common && (
              <p className="text-center text-xs font-bold text-red-500 uppercase tracking-widest">{error.common}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}