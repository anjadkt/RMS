
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

function App() {
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch])

  return (
    <>
     <Routes>
      <Route path="/" element={<ProtectedRoute roleP={"waiter"}><Orders/></ProtectedRoute>} />
      <Route path="/tables" element={<ProtectedRoute roleP={"waiter"}><Table/></ProtectedRoute>} />
      <Route path="/login" element={<PublicRouter><LoginPage/></PublicRouter>} />
      <Route path="/tables/:id" element ={<ProtectedRoute roleP={"waiter"}><EachTable/></ProtectedRoute>} />
     </Routes>
    </>
  )
}

export default App
