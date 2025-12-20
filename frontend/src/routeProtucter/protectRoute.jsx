import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {useState,useEffect} from 'react'
import api from "../services/axios";

export default function ProtecteRoute({children}){
  const [login,setLogin] = useState(false);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    async function fetchUser(){
      try{
        const {data} = await api.get('/auth/customer');
        setLogin(data.userData?.login);
      }catch(error){
        console.log(error)
      }finally{
        setLoading(false);
      }
    }
    fetchUser();
  },[])

  if(loading)return <div>Loading...</div>

  if(!login)return <Navigate to={'/login'} replace />

  return children
}