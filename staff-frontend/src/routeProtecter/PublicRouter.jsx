import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute({children}){
  const {login,loading,role} = useSelector(state => state.user);

  if(loading || login === null)return (
    <div className="flex justify-center mt-10">
      <span className="inline-block text-center h-6 w-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
    </div>
    
  )
  
  if(login === true && role === "waiter")return <Navigate to={'/waiter/orders'} />
  if(login === true && role === "cook")return <Navigate to={'/kitchen/orders'} />

  return children
}