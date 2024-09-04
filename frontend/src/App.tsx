import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from "./pages/NotFound";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "./context/ChatProvider";

const App = () => {
  const context = useContext(ChatContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!context) {
      return;
    }

    const { user } = context;

       if (user?.token) {
      if (location.pathname === "/login") {
        navigate("/", { replace: true });
      }
    } else {
      if (location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
    }

    // Mark the loading as complete
    setLoading(false);
  }, [context, navigate, location]);

  if (!context || loading) {
    // Optionally, show a loading spinner or nothing while loading
    return null; // Or return a loading component
  }

  return (
    <div>
      <ToastContainer autoClose={2000} />
      <Routes>
        <Route path="/login" element={<HomePage />} />
        <Route path="/" element={<ChatPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
