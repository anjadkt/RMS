import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import DotLoader from "../components/DotLoader";

export default function ProtecteRoute({ children }) {
  const { login, loading , isBanned } = useSelector((state) => state.user);

  if (loading) return <DotLoader />;

  if (!login || isBanned) return <Navigate to="/login" />;

  return children;
}