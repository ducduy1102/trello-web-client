import Board from "@/pages/Boards/_id";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth/Auth";
import AccountVerification from "@/pages/Auth/AccountVerification";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/user/userSlice";
import Settings from "@/pages/Settings/Settings";
import Boards from "@/pages/Boards";
import { initSocket } from "./socketClient";

// Route allowed access after login
// Outlet show Child Route
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />;
  return <Outlet />;
};

function App() {
  const currentUser = useSelector(selectCurrentUser);

  // Call socket
  useEffect(() => {
    const socket = initSocket();

    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <Routes>
      {/* Routes chứa danh sách các route. */}
      {/* Route định nghĩa đường dẫn và component tương ứng. */}
      {/* React Router Dom */}
      <Route path='/' element={<Navigate to={"/boards"} replace={true} />} />
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* Board Details */}
        <Route path='/boards/:boardId' element={<Board />} />
        <Route path='/boards' element={<Boards />} />

        {/* User Settings */}
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />
      </Route>

      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/* 404 Not Found */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
