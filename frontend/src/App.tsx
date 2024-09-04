import { Routes, Route } from "react-router-dom"
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <div>
      <ToastContainer autoClose={2000} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="*" element={<NotFound/>}></Route>
      </Routes>

    </div>
  )
}

export default App