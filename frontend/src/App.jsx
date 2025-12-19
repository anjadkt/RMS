import {Routes, Route} from "react-router-dom"
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'

function App() {

  return (
    <>
      <Routes>
        <Route path ="/" element={<Menu/>}/>
        <Route path ="/home" element={<Home/>}/>
      </Routes>
    </>
  )
}

export default App
