import { useRef, useState } from "react"
import {useSelector , useDispatch} from "react-redux"
import {useNavigate} from 'react-router-dom'
import api from "../services/axios";
import { setUserData } from "../app/features/user/userSlice";

export default function Login(){

  const [error,setError] = useState({});
  const [Otploading,setOtpLoading] = useState(false);
  const [loading,setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const inputElem = useRef({
    number : null,
    otp : null
  })

  const validateField = (e)=>{
    
    const newError = {}
    const name = e.name ;
    const value = e.value?.trim();

    if(name === "number"){
      newError.number = value.trim().length !== 10 ? "Enter a valid number" : delete newError.number
    }

    if(name === "otp"){
      newError.otp = value.trim().length < 6 ? "Incorrect OTP" : delete newError.otp ;
    }

    setError(newError);
  }

  const sendOtp = async (e)=>{
    validateField(e);

    if(Object.keys(error).length > 0)return ;

    try{
      setOtpLoading(true);
      const {data} = await api.post('/auth/customer/otp',{number : Number(e.value)});
      if(data.status === 201)setError({});
      setOtpLoading(false);
      console.log(data);

    }catch(error){

      const newError = {}
      if(error.status === 400)newError.number = "Enter a valid Number";
      if(error.status === 429)newError.common = "Too Many Attempts! Try after 5min"
      setError(newError);

    }finally{
      setOtpLoading(false);
    }
  }

  const verifyUser = async(otp,number)=>{
    validateField(otp);
    validateField(number);
    try{
      setLoading(true);
      const {data} = await api.post('/auth/customer/login',{otp : Number(otp.value),number : Number(number.value)});
      setLoading(false);
      dispatch(setUserData(data.userData));
      navigate('/home');

    }catch(error){
  
      const newError = {}
      switch(error.status){
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

  return (
    <>
     <h1>Log in or Sign up</h1>
     <form onSubmit={(e)=>{
      e.preventDefault();
      verifyUser(inputElem.current.otp,inputElem.current.number);
     }}>
        <input
         name="number"
         type="number"
         placeholder="Enter Phone Number!"
         ref={(e)=>inputElem.current.number = e}
        />

        <button type='button' onClick={()=>sendOtp(inputElem.current.number)}>{Otploading ? "..." : "Send OTP"}</button><br />
        <div>{error.number || ""}</div>

        <input 
          name="otp" 
          type="number" 
          placeholder="Enter OTP" 
          ref={(e)=>inputElem.current.otp = e}
        /><br />
        <div></div>

        <button type="submit">{loading ? "..." : "Continue"}</button>
        <div>{error.common || ""}</div>
     </form>
    </>
  )
}