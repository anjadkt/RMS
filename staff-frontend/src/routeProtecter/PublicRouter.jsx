import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute({children}){
  const {login,loading} = useSelector(state => state.user);

  if(loading || login === null)return (
    <span className="inline-block text-center h-6 w-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
  )
  
  if(login === true)return <Navigate to={'/'} />

  return children
}