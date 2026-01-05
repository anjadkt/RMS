
import {Routes, Route} from "react-router-dom"
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
import AdminUsers from "./pages/AdminUsers.jsx"


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
      <Route path="/waiter/orders" element={<ProtectedRoute roleP={"waiter"}><Orders/></ProtectedRoute>} />
      <Route path="/waiter/tables" element={<ProtectedRoute roleP={"waiter"}><Table/></ProtectedRoute>} />
      <Route path="/waiter/tables/:id" element ={<ProtectedRoute roleP={"waiter"}><EachTable/></ProtectedRoute>} />
      <Route path='/waiter/order' element={<ProtectedRoute roleP={"waiter"}><Order/></ProtectedRoute>} />


       <Route path="/kitchen/orders" element={<ProtectedRoute roleP={"cook"}><KitchenOrders/></ProtectedRoute>} />
      <Route path="/kitchen/products" element={<ProtectedRoute roleP={"cook"}><KitchenProducts/></ProtectedRoute>} />

      
      <Route path="/admin/dashboard" element={<ProtectedRoute roleP={"admin"}><AdminDashboard/></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute roleP={"admin"}><AdminOrders/></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute roleP={"admin"}><AdminProducts/></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roleP={"admin"}><AdminUsers/></ProtectedRoute>} />
     </Routes>
    </>
  )
}

export default App
