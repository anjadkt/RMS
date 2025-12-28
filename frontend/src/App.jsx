import {Routes, Route} from "react-router-dom"
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Login from "./pages/Login.jsx"
import ProtectedRoute from './routeProtucter/protectRoute.jsx'
import PublicRoute from "./routeProtucter/publicRoute.jsx"
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import api from "./services/axios.js"
import {setWebsiteData} from "./app/features/website/webSlice.js"
import { checkAuth } from "./app/features/user/userSlice.js"
import Items from "./pages/Items.jsx"
import Checkout from './pages/Checkout.jsx'
import Search from "./pages/Search.jsx"


function App() {
  const dispatch = useDispatch();

  useEffect(()=>{
    async function getWebsiteData() {
      try{
        const {data : websiteData} = await api.get('/resto?settings=true');
        dispatch(setWebsiteData(websiteData.settings));
      }catch(error){
        console.log(error.message);
      }
    }
    getWebsiteData();
  },[])

  useEffect(()=>{
     dispatch(checkAuth());
  },[dispatch]);

  return (
    <>
      <Routes>
        <Route path ="/" element={<Menu/>}/>
        <Route path ="/home" element={<Home/>}/>
        <Route path="/login" element = {<PublicRoute><Login/></PublicRoute>} />
        <Route path="/items/:c" element = {<Items/>} />
        <Route path="/cart" element = {<ProtectedRoute ><Checkout/></ProtectedRoute>} />
        <Route path="/search" element = {<Search/>} />
      </Routes>
    </>
  )
}

export default App
