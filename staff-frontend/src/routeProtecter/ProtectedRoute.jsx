import { useSelector } from "react-redux";
import { Navigate , Outlet } from "react-router-dom";

export default function ProtectedRoute({ roleP, children }) {
  const { login, role ,loading } = useSelector(state => state.user);

  if(loading || login === null)return (
    <div className="flex justify-center mt-10">
      <span className="inline-block text-center h-6 w-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (login === false) {
    return <Navigate to="/login" replace />;
  }

  if (roleP && role !== roleP) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet/>;
}