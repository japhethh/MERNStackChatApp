import { Routes, Route } from "react-router-dom"
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
const App = () => {
  return (
    <div>App

      <button className="btn">Button</button>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>

    </div>
  )
}

export default App