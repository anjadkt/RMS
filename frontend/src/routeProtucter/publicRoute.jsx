import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute({children}){
  const {login , isBanned} = useSelector(state => state.user);

  if(login && !isBanned )return <Navigate to={'/'} />

  return children
}