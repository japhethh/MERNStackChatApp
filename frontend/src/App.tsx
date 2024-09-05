import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from "./pages/NotFound";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "./context/ChatProvider";
import Location from "./components/Location";

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

    // if (user?.token) {
    //   if (location.pathname === "/login") {
    //     navigate("/");
    //   }
    // } else {
    //   if (location.pathname !== "/login") {
    //     navigate("/login");
    //   }
    // }

    // Automatically redirect from login to home if the user is logged in
    if (user?.token && location.pathname === "/login") {
      navigate("/");
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
        <Route path="/location" element={<Location />}></Route>
      </Routes>
    </div>
  );
}

export default App;
