
import {Routes, Route , Navigate} from "react-router-dom"
import LoginPage from "./pages/Login.jsx"
import Orders from "./pages/Orders.jsx"
import { useEffect } from "react"
import {useDispatch} from 'react-redux'
import { checkAuth } from "./app/features/user/userSlice.js"
import PublicRouter from './routeProtecter/PublicRouter.jsx'
import ProtectedRoute from './routeProtecter/ProtectedRoute.jsx'
import Table from "./pages/Tables.jsx"
import EachTable from "./pages/EachTable.jsx"
import Order from "./pages/Order.jsx"
import KitchenOrders from './pages/KitchenOrder.jsx'
import KitchenProducts from "./pages/kitchenProducts.jsx"
import RootRedirect from './routeProtecter/RootRedirect.jsx'
import AdminDashboard from "./pages/AdminDashboard.jsx"
import AdminOrders from "./pages/AdminOrders.jsx"
import AdminProducts from "./pages/AdminProducts.jsx"
import AdminStaffs from "./pages/AdminStaffs.jsx"
import AdminUsersLayout from "./components/AdminUserLayout.jsx"
import AdminCustomers from './pages/AdminCustomers.jsx'
import AdminStaffDetails from './pages/AdminStaffDetials.jsx'
import StaffSetPassword from '././pages/StaffSetPassword.jsx'


function App() {
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(checkAuth());
  },[])

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

      </Route>      
     </Routes>
    </>
  )
}

export default App
