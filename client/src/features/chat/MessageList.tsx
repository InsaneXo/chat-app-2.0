import CustomIcon from '../../components/UI/CustomIcon'
import MessageItem from '../../components/MessageItem'
import { useToast } from '../../context/ToastMessageProvider'
import axios from 'axios'
import { useStore } from '../../context/StoreProvider'
import { useEffect, useState } from 'react'

interface messageType {
  body: string,
  type: string
}

interface messageListType {
  _id: string;
  sender: string;
  content: string;
  messageType: string;
  seenBy: [];
  createdAt: string;
}



const MessageList = () => {
  const { store, selectedChatDetails } = useStore()
  const { setToast } = useToast()
  const [content, setContent] = useState<messageType>({
    body: "",
    type: ""
  })
  const [messageList, setMessageList] = useState<messageListType[]>()
  const sendMessageHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const tempMessage: messageListType = {
        _id: Date.now().toString(),
        sender: store.userId,
        content: content.body,
        messageType: content.type || "text",
        createdAt: new Date().toISOString(),
        seenBy: [],
      }
      await axios({
        url: "/api/chat/message",
        method: "POST",
        data: {
          chatId: selectedChatDetails._id,
          content
        }
      })
      
      setMessageList((prev = []) => [...prev, tempMessage])
      setContent({
        body: "",
        type: ""
      })
    } catch (error: any) {
      if (error) {
        setToast({ status: "Error", message: error.response.data.message })
      }
    }
  }
  const getMessageList = async () => {
    try {

      const { data } = await axios({
        url: `/api/chat/message?chatId=${selectedChatDetails._id}`,
        method: "GET",
      })
      setMessageList(data.messages)
      console.log(data.messages)
    } catch (error: any) {
      if (error) {
        setToast({ status: "Error", message: error.response.data.message })
      }
    }
  }

  useEffect(() => {
    if (!selectedChatDetails._id) return
    getMessageList()
  }, [selectedChatDetails._id])

  return (
    <>
      {selectedChatDetails._id ? <div className="w-full h-screen flex flex-col bg-[url('/images/chatwindowimage.jpg')] ">
        {/* Header */}
        <div className="w-full h-16 bg-white flex items-center justify-between border-b border-gray-200 px-3">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 bg-amber-300 rounded-full flex justify-center items-center">
              {selectedChatDetails.avatar ? (
                <img src={selectedChatDetails.avatar} alt="user_avatar" className="h-full w-full object-cover" />
              ) : (
                <CustomIcon name="solar:user-linear" className="h-7 w-7" />
              )}
            </div>
            <h1 className="">{selectedChatDetails.name}</h1>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-10 w-10 hover:bg-[#EAE8E6] rounded-full flex items-center justify-center cursor-pointer">
              <CustomIcon name="bitcoin-icons:search-filled" />
            </div>
            <div className="h-10 w-10 hover:bg-[#EAE8E6] rounded-full flex items-center justify-center cursor-pointer">
              <CustomIcon name="qlementine-icons:menu-dots-16" />
            </div>
          </div>
        </div>

        {/* Scrollable Chat Area */}
        <div
          className="flex-1 w-full  
             p-3 flex flex-col-reverse gap-2 overflow-y-auto"
        >
          {messageList?.map((item) => <MessageItem
            key={item._id}
            message={item.content}
            isSender={item.sender === store.userId}
            isRead={true}
            time="10:00 am"
          />).reverse()}

        </div>


        {/* Input Bar */}
        <div className="w-[97%] m-auto my-2 h-16 bg-white flex items-center gap-2 px-4 border-[1px] rounded-full border-gray-300 shadow-md">
          <div className="h-10 w-10 hover:bg-[#EAE8E6] rounded-full flex justify-center items-center cursor-pointer">
            <CustomIcon name="material-symbols:add-rounded" />
          </div>
          <div className="h-10 w-10 hover:bg-[#EAE8E6] rounded-full flex justify-center items-center cursor-pointer">
            <CustomIcon name="weui:sticker-outlined" />
          </div>
          <form onSubmit={sendMessageHandler} className='flex items-center w-full'>
            <input
              className="flex-1 h-full border-none outline-none px-3"
              type="text"
              value={content.body}
              onChange={(e) => setContent({ body: e.target.value, type: "text" })}
              placeholder="Enter a message"
            />
            {content.body && <button type='submit' className="h-12 w-12 rounded-full flex justify-center items-center bg-[#4ABB81] cursor-pointer">
              <CustomIcon name="material-symbols-light:send" className="text-white" />
            </button>}
          </form>
        </div>
      </div> : <div className="w-full h-full flex justify-center items-center bg-gradient-to-b text-white">
        <div className="flex flex-col justify-center items-center text-center space-y-6 p-8 rounded-2xl shadow-lg bg-[#F6F5F4] backdrop-blur-lg">
          <img
            src="/images/favicon.png"
            alt="connectWave_logo"
            className="w-32 h-32 mb-2 animate-bounce-slow"
          />
          <h1 className="text-3xl font-semibold text-[#29D369]">ConnectWave</h1>
          <p className="text-lg max-w-md text-gray-500 leading-relaxed">
            Tap on a chat to keep the conversation going.
          </p>
        </div>
      </div>}
    </>

  )
}

export default MessageList
