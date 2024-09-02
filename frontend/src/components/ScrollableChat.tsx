import  { useContext } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameUser, isSameSenderMargin } from '../config/ChatLogics';
import { ChatContext } from '../context/ChatProvider';

const ScrollableChat = ({ messages }: any) => {
  const context = useContext(ChatContext);
  if (!context) {
    return null;
  }
  const { user } = context;

  return (
    <ScrollableFeed>
      {messages && messages.map((m: any, i: any) => (
        <div
          key={m._id}
          className={`flex ${m.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
        >
          {/* Conditionally render the sender image */}
          {(isSameSender(messages, m, i, user?._id) || isLastMessage(messages, i, user?._id)) && (
            <div className="tooltip" data-tip={m.sender.name}>
              <img
                className={`mt-2 text-sm cursor-pointer rounded-full h-10 ${m.sender._id === user?._id ? 'ml-2' : 'mr-2'}`}
                src={m.sender.pic}
                alt={m.sender.name}
              />
            </div>
          )}

          {/* Render the message content */}
          <div
            className={`chat-bubble ${m.sender._id === user?._id ? 'chat-bubble-right' : 'chat-bubble-left'
              }`}
            style={{
              marginLeft: isSameSenderMargin(messages, m, i, user?._id),
              marginTop: isSameUser(messages, m, i) ? 3 : 10,
            }}
          >
            {m.content}
          </div>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
