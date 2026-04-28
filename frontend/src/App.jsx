import {Routes, Route} from "react-router-dom"
import { useDispatch , useSelector } from "react-redux"
import { lazy, Suspense, useEffect, useRef } from "react"
import { checkAuth } from "./app/features/user/userSlice.js"
import {getWebsiteData} from './app/features/website/webSlice.js'
import socket from './services/socket.js'
import {showNotification} from './app/features/user/userSlice.js'

import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Login from "./pages/Login.jsx"
import Items from "./pages/Items.jsx"
import Checkout from './pages/Checkout.jsx'
import Search from "./pages/Search.jsx"

import ProtectedRoute from './routeProtucter/protectRoute.jsx'
import PublicRoute from "./routeProtucter/publicRoute.jsx"

import ToastNotification from "./components/ToastNoti.jsx"
import DotLoader from "./components/DotLoader.jsx"
import MainOfferWrapper from './components/MainOffer.jsx'


const QrScanner = lazy(() => import("./pages/QrScanner.jsx"));
const ClosedStoreOverlay = lazy(() => import("./components/ClosedStoreOverlay.jsx"));
const History = lazy(() => import ("./pages/History.jsx"));
const Privacy  = lazy(() => import ("./pages/Privacy.jsx") );
const Terms  = lazy(() => import ("./pages/Terms.jsx") );
const Refund  = lazy(() => import ("./pages/Refund.jsx") );
const Contact  = lazy(() => import ("./pages/Contact.jsx") );


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
    <Suspense fallback={<DotLoader />}><ClosedStoreOverlay/></Suspense>
  )

  return (
    <>
      <ToastNotification />

      <Suspense fallback={<DotLoader />}>
      <Routes>
        <Route path ="/" element={<Menu/>}/>
        <Route path ="/home" element={<MainOfferWrapper><Home/></MainOfferWrapper>}/>
        <Route path="/login" element = {<PublicRoute><Login/></PublicRoute>} />
        <Route path="/items/:c" element = {<Items/>} />
        <Route path="/cart" element = {<ProtectedRoute ><Checkout/></ProtectedRoute>} />
        <Route path="/search" element = {<Search/>} />

        <Route path="/scan" element={<ProtectedRoute> <QrScanner /> </ProtectedRoute>} />
        <Route path="/history" element={ <ProtectedRoute><History /> </ProtectedRoute>} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-and-conditions" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/shipping-policy" element={<Contact />} />
      </Routes>
      </Suspense>

      <audio ref={soundElem} src="/sound/customerNoti.mp3" preload="auto" />
    </>
  )
}

export default App
