import {Routes, Route} from "react-router-dom"
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Login from "./pages/Login.jsx"
import ProtectedRoute from './routeProtucter/protectRoute.jsx'
import PublicRoute from "./routeProtucter/publicRoute.jsx"
import { useDispatch , useSelector } from "react-redux"
import { useEffect, useRef } from "react"
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
import socket from './services/socket.js'
import {showNotification} from './app/features/user/userSlice.js'
import Message from './pages/Message.jsx'

function App() {
  const dispatch = useDispatch();
  const soundElem = useRef(null);

  const {login} = useSelector(state => state.user);
  const {status} = useSelector(state => state.website);

  useEffect(() => {
    if (login) {
      socket.connect();
    } else {
      socket.disconnect();
    }
  }, [login]);

  useEffect(()=>{
    dispatch(checkAuth());
    dispatch(getWebsiteData());

    socket.on("connect", () => {
     console.log(`🟢 socket connected:`, socket.id);
    });

    const handleNoti = ({notiData}) =>{
      dispatch(showNotification(notiData));
      if(soundElem.current){
        soundElem.current.currentTime = 0;
        soundElem.current.play().catch(() => {
        });
      }
    }

    const onDisconnect = () => {
     console.log(`🔴 socket disconnected:`);
    }

    socket.on("new-noti",handleNoti);

    socket.on("disconnect", onDisconnect);

    return ()=>{
      socket.off("new-noti",handleNoti);
      socket.off("disconnect", onDisconnect);
    }

  },[]);

  if(status === "closed")return (
    <ClosedStoreOverlay/>
  )

  return (
    <>
      <ToastNotification />
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
        <Route path="/terms-and-conditions" element={<Terms/>} />
        <Route path="/refund" element={<Refund/>} />
        <Route path="/shipping-policy" element={<Contact/>} />
        <Route path='/message' element={<Message/>} />
      </Routes>

      <audio ref={soundElem} src="/sound/customerNoti.mp3" preload="auto" />
    </>
  )
}

export default App
