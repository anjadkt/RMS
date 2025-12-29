import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute({children}){
  const login = useSelector(state => state.user.login);

  if(login)return <Navigate to={'/'} />

  return children
}