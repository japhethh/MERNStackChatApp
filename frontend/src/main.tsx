import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import UserContextProvider from './context/UserContext.tsx'
import ChatProvider from './context/ChatProvider.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ChatProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </ChatProvider>
  </BrowserRouter>
)
