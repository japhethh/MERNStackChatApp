import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from "./pages/NotFound";
import { useContext, useEffect } from "react";
import { ChatContext } from "./context/ChatProvider";

const App = () => {
  const context = useContext(ChatContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    if (!context) {
      return;
    }
    const { user } = context;

    if (user?.token) {
      if (location.pathname === "/login") {
        navigate("/")
      }
    } else {
      if (location.pathname !== "/login") {
        navigate("/login")
      }
    }
  }, [context, navigate, location])

  if (!context) {
    return null;
  }

  return (
    <div>
      <ToastContainer autoClose={2000} />
      <Routes>
        <Route path="/login" element={<HomePage />} />
        <Route path="/" element={<ChatPage />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>

    </div>
  )
}

export default App