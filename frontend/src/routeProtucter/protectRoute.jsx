import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import DotLoader from "../components/DotLoader";

export default function ProtecteRoute({ children }) {
  const { login, loading } = useSelector((state) => state.user);

  if (loading) return <DotLoader />;

  if (login === false) return <Navigate to="/login" replace />;

  return children;
}