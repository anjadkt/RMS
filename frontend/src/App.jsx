import {Routes, Route} from "react-router-dom"
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Login from "./pages/Login.jsx"
import ProtectedRoute from './routeProtucter/protectRoute.jsx'
import PublicRoute from "./routeProtucter/publicRoute.jsx"


function App() {

  return (
    <>
      <Routes>
        <Route path ="/" element={<Menu/>}/>
        <Route path ="/home" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path="/login" element = {<PublicRoute><Login/></PublicRoute>} />
      </Routes>
    </>
  )
}

export default App
