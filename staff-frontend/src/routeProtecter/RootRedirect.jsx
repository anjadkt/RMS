import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RootRedirect(){
  const {role,login,loading} = useSelector(state => state.user);

  if(loading)return (
    <div className="flex justify-center mt-10">
      <span className="inline-block text-center h-6 w-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if(login === false)return <Navigate to="/login" />

  if (role === "waiter") return <Navigate to="/waiter/orders" />;
  if (role === "cook") return <Navigate to="/kitchen/orders" />;
  if (role === "admin") return <Navigate to="/admin/dashboard" />;

}