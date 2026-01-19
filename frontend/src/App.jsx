import {Routes, Route} from "react-router-dom"
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Login from "./pages/Login.jsx"
import ProtectedRoute from './routeProtucter/protectRoute.jsx'
import PublicRoute from "./routeProtucter/publicRoute.jsx"
import { useDispatch , useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { checkAuth } from "./app/features/user/userSlice.js"
import Items from "./pages/Items.jsx"
import Checkout from './pages/Checkout.jsx'
import Search from "./pages/Search.jsx"
import History from "./pages/History.jsx"
import ClosedStoreOverlay from './components/ClosedStoreOverlay.jsx'
import MainOfferWrapper from './components/MainOffer.jsx'
import {getWebsiteData} from './app/features/website/webSlice.js'
import ToastNotification from "./components/ToastNoti.jsx"
import QrScanner from "./pages/QrScanner.jsx"
import Privacy from "./pages/Privacy.jsx"
import Terms from "./pages/Terms.jsx"
import Refund from "./pages/Refund.jsx"
import Contact from "./pages/Contact.jsx"


function App() {
  const dispatch = useDispatch();

  const {status} = useSelector(state => state.website);

  useEffect(()=>{
     dispatch(checkAuth());
     dispatch(getWebsiteData());
  },[]);

  if(status === "closed")return (
    <ClosedStoreOverlay/>
  )

  return (
    <>
      {/* <ToastNotification /> */}
      <Routes>
        <Route path ="/" element={<Menu/>}/>
        <Route path ="/home" element={<MainOfferWrapper><Home/></MainOfferWrapper>}/>
        <Route path="/login" element = {<PublicRoute><Login/></PublicRoute>} />
        <Route path="/items/:c" element = {<Items/>} />
        <Route path="/cart" element = {<ProtectedRoute ><Checkout/></ProtectedRoute>} />
        <Route path="/search" element = {<Search/>} />
        <Route path="/history" element = {<ProtectedRoute><History/></ProtectedRoute>} />
        <Route path="/scan" element = {<ProtectedRoute><QrScanner/></ProtectedRoute>} />
        <Route path="/privacy-policy" element={<Privacy/>} />
        <Route path="/terms" element={<Terms/>} />
        <Route path="/refund" element={<Refund/>} />
        <Route path="/contact" element={<Contact/>} />
      </Routes>
    </>
  )
}

export default App
