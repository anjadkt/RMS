import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {useState,useEffect} from 'react'
import api from "../services/axios";

export default function ProtecteRoute({children}){
  const login = useSelector(state => state.user.login);

  if(!login)return <Navigate to={'/login'} replace />

  return children
}