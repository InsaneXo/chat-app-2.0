import { useCallback } from 'react'
import { useSocket } from '../../context/SocketProvider'
import { UseSocketEvents } from '../../hooks/UseSocketEvents'
import ChatList from './ChatList'
import MessageList from './MessageList'
import { useStore } from '../../context/StoreProvider'



const ChatWindow = () => {
  const socket = useSocket()
  const { store,} = useStore()

  const sendRequestListener = useCallback((data:any)=>{
    if(!store.userId) return
    console.log(data, )
  },[store.userId])

  const socketListenersocketListener = {
    ["SEND_REQUEST"]: sendRequestListener,
  };

  UseSocketEvents(socket, socketListenersocketListener)

  return (
    <div className='flex-1 flex'>
      <ChatList />
      <MessageList />
    </div>
  )
}

export default ChatWindow