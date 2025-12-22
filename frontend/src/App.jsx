import {Routes, Route} from "react-router-dom"
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Login from "./pages/Login.jsx"
import ProtectedRoute from './routeProtucter/protectRoute.jsx'
import PublicRoute from "./routeProtucter/publicRoute.jsx"
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import api from "./services/axios.js"
import { setUserData } from "./app/features/user/userSlice.js"
import {setWebsiteData} from "./app/features/website/webSlice.js"
import { useNavigate } from "react-router-dom"

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    async function getUserData() {
      try{
        const {data} = await api.get('auth/customer');
        const {data : websiteData} = await api.get('/resto?settings=true');

        dispatch(setWebsiteData(websiteData.settings));
        dispatch(setUserData(data.userData));
      }catch(error){
        if(error.status === 404){
          navigate('/login');
        }
      }
    }
    getUserData();
  })

  return (
    <>
      <Routes>
        <Route path ="/" element={<Menu/>}/>
        <Route path ="/home" element={<Home/>}/>
        <Route path="/login" element = {<PublicRoute><Login/></PublicRoute>} />
      </Routes>
    </>
  )
}

export default App
