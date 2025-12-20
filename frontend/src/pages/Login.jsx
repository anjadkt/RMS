import { useState } from "react"
import {useNavigate} from 'react-router-dom'
import api from "../services/axios";

export default function Login(){

  const [error,setError] = useState({});
  const [Otploading,setOtpLoading] = useState(false);
  const [loading,setLoading] = useState(false);

  const [form,setForm] = useState({
    number : "",
    otp : ""
  });

  const navigate = useNavigate();

  const handleChange = (e)=>{
    setForm({...form , [e.target.name] : e.target.value});
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

      const {data} = await api.post('/auth/customer/otp',{number : Number(form.number)});

      if(data.ok)setError({});

      console.log(data);

    }catch(error){

      const newError = {}

      switch(error.response.status){

        case 400 :
          newError.number = "Enter a valid Number"
        case 429 :
          newError.common = "Too Many Attempts! Try after 5min"
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
      const {data} = await api.post('/auth/customer/login',{otp : Number(form.otp),number : Number(form.number)});

      if(data.ok)setError({});

      navigate('/home');

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

  return (
    <>
     <h1>Log in or Sign up</h1>
     <form onSubmit={(e)=>{
      e.preventDefault();
      verifyUser();
     }}>
        <input
         name="number"
         type="number"
         placeholder="Enter Phone Number!"
         onChange={handleChange}
        />

        <button type='button' onClick={sendOtp}>{Otploading ? "..." : "Send OTP"}</button><br />
        <div>{error.number || ""}</div>

        <input 
          name="otp" 
          type="number" 
          placeholder="Enter OTP" 
          onChange={handleChange}
        /><br />
        <div></div>

        <button type="submit">{loading ? "..." : "Continue"}</button>
        <div>{error.common || ""}</div>
     </form>
    </>
  )
}