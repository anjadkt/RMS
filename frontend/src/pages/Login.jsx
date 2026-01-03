import { useState , useEffect } from "react"
import {useNavigate} from 'react-router-dom'
import api from "../services/axios";
import DotLoader from '../components/DotLoader.jsx'
import {checkAuth} from '../app/features/user/userSlice.js'
import { useDispatch } from "react-redux";

export default function Login(){

  const dispatch = useDispatch();
  const [error,setError] = useState({});
  const [Otploading,setOtpLoading] = useState(false);
  const [loading,setLoading] = useState(false);
  const [ok,setOk] = useState(false);
  const [time,setTime] = useState(0)

  const [form,setForm] = useState({
    number : "",
    otp : "",
    countryCode : "+91"
  });

  const navigate = useNavigate();

  const handleChange = (e)=>{
    setForm({...form , [e.target.name] : e.target.value?.replace(/\D/g,"")});
  }

  const validate = (field) =>{

    const newError = {}

    if(!form.number?.trim()){
      newError.number = "Number Required!"
    }else if(form.number.length !== 10){
        newError.number = "Enter a Valid Number"
    }
    
    if(field !== "otp"){
      if(!form.otp?.trim()){
        newError.otp = "Otp Required!"
      }else if(form.otp?.length !== 6){
          newError.otp = "Enter a Valid Otp"
      }
    }

    setError(newError);

    return Object.keys(newError).length > 0
  }

  const sendOtp = async ()=>{

    if(validate("otp"))return ;

    try{

      setOtpLoading(true);

      const {data} = await api.post('/auth/customer/otp',{number : form.countryCode?.trim() + form.number?.trim()});

      console.log(data);

      setTime(30);

      if(data.ok){
        setError({});
        setOk(true);
      }

    }catch(error){

      const newError = {}

      switch(error.response.status){

        case 400 :
          newError.number = "Enter a valid Number"
        case 429 :
          newError.common = "Too Many Attempts! Try after 5min"
        case 500 :
          newError.common = "Internal Server Errror!"
      }

      setError(newError);

    }finally{
      setOtpLoading(false);
    }
  }

  const verifyUser = async()=>{

    if(validate("continue"))return ;

    try{
      setLoading(true);
      const {data} = await api.post('/auth/customer/login',{otp : Number(form.otp),number : form.countryCode?.trim() + form.number?.trim()});

      if(data.ok){
        setError({});
      };

      dispatch(checkAuth());

      navigate('/');

    }catch(error){
  
      const newError = {}
      switch(error.response.status){
        case 400 : 
          newError.number = "Required!";
          newError.otp = "Required!"
          break ;
        case 404 :
          newError.otp =  "incorrect otp";
          break ;
        case 406 :
          newError.otp =  "incorrect otp";
          break ;
      }
      setError(newError);

    }finally{
        setLoading(false);
    }
  }

  useEffect(()=>{
    if(time===0)return ;
    const timeout = setTimeout(()=>{
      setTime(pre => pre-1);
    },1000)
    return ()=> clearTimeout(timeout);
  },[time])

  if(Otploading || loading) return <DotLoader />

  return (
    <>
      <div className="min-h-screen flex justify-center items-start pt-20 bg-gray-100 px-4">
        <div className="max-w-md bg-gray-100 rounded-2xl px-8 py-6 lg:shadow-lg">
          
          <div className="flex justify-center">
            <img
              className="h-36"
              src="https://res.cloudinary.com/dcsmtagf7/image/upload/v1766284983/logoLogin_spt4f6.png"
            />
          </div>

          <div className="border-b h-1 relative border-gray-300 my-4">
            <p className="text-xs p-1 absolute -top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100 text-gray-500 z-10 mt-1">
              Login or Signup
            </p>
          </div>

          <form
            className="mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              verifyUser();
            }}
          >
            <div className={ok ? "hidden" : "display-block"}>
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>

              <div className="flex gap-2 font-normal">
                <select onChange={handleChange} name="countryCode" className="rounded-lg border border-gray-300 px-1 py-2 focus:outline-none">
                  <option className="text-lg">+91</option>
                  <option className="text-lg">+1</option>
                </select>
                <input
                  id="number"
                  name="number"
                  type="text"
                  maxLength={10}
                  value={form.number}
                  inputMode="numeric"
                  placeholder="Enter phone number"
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>

              <div className="text-xs text-red-500 mt-1">
                {error.number || ""}
              </div>
              <button
                  type="button"
                  onClick={sendOtp}
                  className="w-full bg-[#cd0045] mt-4 cursor-pointer text-white font-semibold py-1.5 rounded-lg transition"
                > 
                Continue
              </button>
            </div>

            <div className={ok ? "display-block" : "hidden" }>
              <div className="border-gray-200">
              <label className="block text-sm font-normal text-gray-700 mb-3 text-center">
                Enter 6-digit OTP send to <span className="font-medium text-black">{form.number}</span>
              </label>

              <div className="flex flex-col justify-center gap-2">
                <input
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={form.otp || ""}
                  onChange={handleChange}
                  className="w-full h-10 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none"
                />
                <div className="text-xs text-red-500 mt-1">
                 {error.otp || ""}
                </div>
              </div>

              <div className="flex justify-center gap-1 mt-3 mb-1 items-center text-sm">

                <button
                  type="button"
                  className="font-medium hover:underline cursor-pointer"
                  onClick={sendOtp}
                  disabled={time}
                >
                  Resend OTP?
                </button>

                <span className="text-gray-500">
                   {!time ? <b>Now</b> : <>in <span className="font-medium">{time}s</span></>}
                </span>
              </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black cursor-pointer hover:bg-gray-900 text-white font-semibold py-1.5 rounded-lg transition"
              >
                Continue
              </button>
            </div>

            <div className="text-sm text-center text-red-500">
              {error.common || ""}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}