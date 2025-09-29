import ChatList from './ChatList'
import MessageList from './MessageList'

const ChatWindow = () => {
  return (
    <div className='flex-1 flex'>
        <ChatList/>
        <MessageList/>
    </div>
  )
}

export default ChatWindow