
import {Routes, Route} from "react-router-dom"
import LoginPage from "./pages/Login.jsx"

function App() {

  return (
    <>
     <Routes>
      <Route path="/login" element={<LoginPage/>} />
     </Routes>
    </>
  )
}

export default App
