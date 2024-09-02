import { createContext, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface ChatContextValue {
  user: User | null;
  setSelectedChat: (value: any) => void;
  selectedChat: any;
  chats: any;
  setChats: any;
  notification:any;
  setNotification:any
  // setUser:any
}

interface User {
  name: string;
  email: string;
  token: string;
  _id: string;
  pic:string;

  // Add more fields as needed
}

export const ChatContext = createContext<ChatContextValue | null>(null);

const ChatProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([])
  const navigate = useNavigate();


  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const contextValue: ChatContextValue = {
    user,
    setSelectedChat,
    selectedChat,
    chats,
    setChats,
    notification,
    setNotification,

    // setUser,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
