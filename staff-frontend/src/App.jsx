
import {Routes, Route} from "react-router-dom"
import LoginPage from "./pages/Login.jsx"
import Orders from "./pages/Orders.jsx"
import { useEffect } from "react"
import {useDispatch} from 'react-redux'
import { checkAuth } from "./app/features/user/userSlice.js"
import PublicRouter from './routeProtecter/PublicRouter.jsx'
import ProtectedRoute from './routeProtecter/ProtectedRoute.jsx'

function App() {
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch])

  return (
    <>
     <Routes>
      <Route path="/" element={<ProtectedRoute roleP={"waiter"}><Orders/></ProtectedRoute>} />
      <Route path="/login" element={<PublicRouter><LoginPage/></PublicRouter>} />
     </Routes>
    </>
  )
}

export default App
