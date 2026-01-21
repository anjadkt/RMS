
import {Routes, Route , Navigate} from "react-router-dom"
import LoginPage from "./pages/Login.jsx"
import Orders from "./pages/Orders.jsx"
import { useEffect , useRef } from "react"
import {useDispatch , useSelector} from 'react-redux'
import { checkAuth } from "./app/features/user/userSlice.js"
import PublicRouter from './routeProtecter/PublicRouter.jsx'
import ProtectedRoute from './routeProtecter/ProtectedRoute.jsx'
import Table from "./pages/Tables.jsx"
import EachTable from "./pages/EachTable.jsx"
import Order from "./pages/Order.jsx"
import Updates from './pages/WaiterUpdates.jsx'
import KitchenOrders from './pages/KitchenOrder.jsx'
import KitchenProducts from "./pages/KitchenOrder.jsx"
import RootRedirect from './routeProtecter/RootRedirect.jsx'
import AdminDashboard from "./pages/AdminDashboard.jsx"
import AdminOrders from "./pages/AdminOrders.jsx"
import AdminProducts from "./pages/AdminProducts.jsx"
import AdminStaffs from "./pages/AdminStaffs.jsx"
import AdminUsersLayout from "./components/AdminUserLayout.jsx"
import AdminCustomers from './pages/AdminCustomers.jsx'
import AdminStaffDetails from './pages/AdminStaffDetials.jsx'
import StaffSetPassword from './pages/StaffSetPassword.jsx'
import AdminCustomerDetails from './pages/AdminCustomerDetails.jsx'
import AdminTables from './pages/AdminTables.jsx'
import AdminTableDetails from './pages/AdminTableDetails.jsx'
import AdminSettings from './pages/AdminSettings.jsx'
import WaiterBills from "./pages/WaiterBills.jsx"
import socket from "./services/socket.js"
import {setPlacedOrders,setReadyOrders} from './app/features/order/orderSlice.js'
import AdminBills from "./pages/AdminBills.jsx"


function App() {
  const dispatch = useDispatch();
  const {role,login,id} = useSelector(state => state.user);

  const soundElem = useRef(null);
  const kitchenNoti = useRef(null);

  useEffect(()=>{
    dispatch(checkAuth());
  },[]);

  useEffect(() => {
    if (login) {
      socket.connect();
    } else {
      socket.disconnect();
    }
  }, [login]);

  useEffect(()=>{

    socket.on("connect", () => {
      console.log(`🟢 socket connected:`, socket.id);
    });
    

    const eventHandler = ({order})=>{

      dispatch(setPlacedOrders(order))

      if(soundElem.current){
        soundElem.current.currentTime = 0;
        soundElem.current.play().catch(() => {
        });
      }

      if (navigator.vibrate) {
        navigator.vibrate([600, 200, 600, 200, 600]);
      }
    }

    const readyEvent = ({order})=>{
      
      dispatch(setReadyOrders(order));

      if(soundElem.current){
        soundElem.current.currentTime = 0;
        soundElem.current.play().catch(() => {
        });
      }

      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    }

    const handleEvent = ({order})=>{
      dispatch(setPlacedOrders(order));
      if(kitchenNoti.current){
        kitchenNoti.current.currentTime = 0;
        kitchenNoti.current.play().catch(() => {
        });
      }
    }

    const onDisconnect = () => {
      console.log(`🔴 socket disconnected`);
    }

    socket.on("new-order",eventHandler);
    socket.on("order-ready",readyEvent);
    socket.on('order-accepted',handleEvent);
    socket.on("disconnect", onDisconnect);

    return ()=> {
      socket.off("new-order",eventHandler);
      socket.off("order-ready",readyEvent);
      socket.off('order-accepted',handleEvent);
      socket.off("disconnect", onDisconnect);
    }
  },[]);

  return (
    <>
     <Routes>
      <Route path="/" element={<RootRedirect/>} />
      <Route path="/login" element={<PublicRouter><LoginPage/></PublicRouter>} />
      <Route path="/staff/password/:token" element={<PublicRouter><StaffSetPassword/></PublicRouter>} />

      <Route element={<ProtectedRoute roleP={"waiter"} />}>
        <Route path="/waiter/orders" element={<Orders/>} />
        <Route path="/waiter/tables" element={<Table/>} />
        <Route path="/waiter/tables/:id" element ={<EachTable/>} />
        <Route path='/waiter/order' element={<Order/>} />
        <Route path="/waiter/bills" element={<WaiterBills/>} />
        <Route path='/waiter/updates' element={<Updates/>} /> 
      </Route>

      <Route element={<ProtectedRoute roleP={"cook"}></ProtectedRoute>}>
        <Route path="/kitchen/orders" element={<KitchenOrders/>} />
        <Route path="/kitchen/products" element={<KitchenProducts/>} />
      </Route>
      
      <Route element={<ProtectedRoute roleP="admin" />}>
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/admin/orders" element={<AdminOrders/>} />
        <Route path="/admin/products" element={<AdminProducts/>} />     
        <Route path="/admin/users" element={<AdminUsersLayout />}>
          <Route index element={<Navigate to="staffs" replace />} />
          <Route path="staffs" element={<AdminStaffs />} />
          <Route path="customers" element={<AdminCustomers />} />
        </Route>
        <Route path="/admin/users/staffs/:id" element={<AdminStaffDetails/>} />
        <Route path="/admin/users/customer/:id" element={<AdminCustomerDetails />} />
        <Route path="/admin/tables" element={<AdminTables />} />
        <Route path="/admin/tables/:id" element={<AdminTableDetails/>} />
        <Route path="/admin/settings" element={<AdminSettings/>} />
        <Route path="/admin/bills" element={<AdminBills/>} />
      </Route>     

     </Routes>

     <audio ref={soundElem} src="/sounds/waiterNoti.mp3" preload="auto" />
     <audio ref={kitchenNoti} preload="auto" src="/sounds/chefNoti.mp3" />

    </>
  )
}

export default App
