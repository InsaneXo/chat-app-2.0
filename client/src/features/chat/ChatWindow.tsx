import { useEffect, useState } from 'react'
import ChatList from './ChatList'
import MessageList from './MessageList'
import axios from 'axios';
import { useToast } from '../../context/ToastMessageProvider';
import type { ChatListTypes } from '../../types/component';
import { useStore } from '../../context/StoreProvider';



const ChatWindow = () => {
  const [chatList, setChatList] = useState<ChatListTypes[]>([])
  const { setToast } = useToast()
  const { selectedId } = useStore()

  const fetchChatList = async () => {
    try {
      const { data } = await axios({
        url: "/api/chat",
        method: "GET",
      })
      setChatList(data.chats)
    } catch (error: any) {
      if (error) {
        setToast({ status: "Error", message: error.response.data.message })
      }
    }
  }

  useEffect(() => {
    fetchChatList()
  }, [])

  return (
    <div className='flex-1 flex'>
      <ChatList chatList={chatList} />
      <MessageList />
    </div>
  )
}

export default ChatWindow