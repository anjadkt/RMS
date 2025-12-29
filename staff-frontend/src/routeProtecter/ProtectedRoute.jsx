import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ roleP, children }) {
  const { login, role } = useSelector(state => state.user);

  if (login === false) {
    return <Navigate to="/login" replace />;
  }

  if (roleP && role !== roleP) {
    return <Navigate to="/login" replace />;
  }

  return children;
}