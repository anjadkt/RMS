import {Routes, Route} from "react-router-dom"
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Login from "./pages/Login.jsx"


function App() {

  return (
    <>
      <Routes>
        <Route path ="/" element={<Menu/>}/>
        <Route path ="/home" element={<Home/>}/>
        <Route path="/login" element = {<Login/>} />
      </Routes>
    </>
  )
}

export default App
