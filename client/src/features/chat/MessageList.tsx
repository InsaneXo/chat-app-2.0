import CustomIcon from '../../components/UI/CustomIcon'
import MessageItem from '../../components/MessageItem'
import { useToast } from '../../context/ToastMessageProvider'
import axios from 'axios'
import { useStore } from '../../context/StoreProvider'
import { useCallback, useEffect, useRef, useState } from 'react'
import useInfiniteScroll from '../../hooks/UseInfiniteScroll'
import { useSocket } from '../../context/SocketProvider'
import { UseSocketEvents } from '../../hooks/UseSocketEvents'

interface messageType {
  body: string,
  type: string
}

interface messageListType {
  _id: string;
  sender: string;
  content: string;
  messageType: string;
  seenBy: string[];
  createdAt: string;
}

const MessageList = () => {
  const { store, selectedChatDetails, notification, setNotification } = useStore()
  const socket = useSocket()


  const { setToast } = useToast()
  const [content, setContent] = useState<messageType>({
    body: "",
    type: ""
  })

  const [messageList, setMessageList] = useState<messageListType[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessageHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!content.body.trim()) return;

    try {
      chatEndRef.current?.scrollIntoView({ behavior: 'instant' })
      setContent({
        body: "",
        type: ""
      })
      socket?.emit("SEND_MESSAGE", { chatId: selectedChatDetails._id, content })
    } catch (error: any) {
      if (error) {
        setToast({ status: "Error", message: error.response.data.message })
      }
    }
  }

  const loadMoreMessages = async () => {
    if (!selectedChatDetails._id) return;
    try {
      const { data } = await axios({
        url: `/api/chat/message`,
        method: "GET",
        params: {
          chatId: selectedChatDetails._id,
          page,
          limit: 18
        }
      })

      const newMessages: messageListType[] = data.messages || []

      if (isInitialLoad) {
        setMessageList(newMessages)
        setIsInitialLoad(false)

        setTimeout(() => {
          chatEndRef.current?.scrollIntoView({ behavior: 'instant' })
        }, 100)
      } else {
        setMessageList((prev) => [...prev, ...newMessages])
      }

      setPage(prev => prev + 1)

      if (newMessages.length === 0 || page >= data.totalPages) {
        setHasMore(false)
      }

    } catch (error: any) {
      if (error) {
        setToast({ status: "Error", message: error.response.data.message })
      }
    }
  }

  const { containerRef, loading } = useInfiniteScroll({
    loadMore: loadMoreMessages,
    hasMore,
  });

  




  const newMessagesListener = useCallback(
    (data: any) => {
      if (data.chatId !== selectedChatDetails._id) return
      setMessageList((prev) => [data.message, ...prev]);
      if (data.message.sender === store.userId) return
      socket?.emit("SEEN_MESSAGE", { messageId: [data.message._id], users: store.userId })
    },
    [selectedChatDetails._id]
  );

  const markAsReadListener = useCallback((data: any) => {
    if (data.chatId !== selectedChatDetails._id) return;
    setMessageList((prev) =>
      prev.map((msg) =>
        msg._id === data.messageId
          ? { ...msg, seenBy: [data.user] }
          : msg
      )
    );

  }, [selectedChatDetails._id])

  const seenAllMessagelistener = useCallback((data: any) => {
    if (data.chatId !== selectedChatDetails._id) return;
    setMessageList((prev) =>
      prev.map((item) => {
        const matchedMsg = data.messages.find((msg: any) => msg._id === item._id);
        if (matchedMsg) {
          return { ...item, seenBy: [data.user] };
        }
        return item;
      })
    );
  }, [selectedChatDetails._id])

  const eventHandler = {
    ["MESSAGE"]: newMessagesListener,
    ["SEEN_MESSAGE"]: markAsReadListener,
    ["SEEN_ALL_MESSAGE"]: seenAllMessagelistener
  };

  UseSocketEvents(socket, eventHandler)

  useEffect(() => {
    if (!selectedChatDetails._id) return

    setMessageList([])
    setPage(1)
    setHasMore(true)
    setIsInitialLoad(true)

    socket?.emit("SEEN_ALL_MESSAGE", { chatId: selectedChatDetails._id, users: store.userId })
    loadMoreMessages()
  }, [selectedChatDetails._id])

  return (
    <>
      {selectedChatDetails._id ? (
        <div className="w-full h-screen flex flex-col bg-[url('/images/chatwindowimage.jpg')]">
          {/* Header */}
          <div className="w-full h-16 bg-white flex items-center justify-between border-b border-gray-200 px-3">
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 bg-amber-300 rounded-full flex justify-center items-center">
                {selectedChatDetails.avatar ? (
                  <img src={selectedChatDetails.avatar} alt="user_avatar" className="h-full w-full object-cover rounded-full" />
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

          <div
            ref={containerRef}
            className="flex-1 w-full p-3 flex flex-col-reverse gap-2 overflow-auto"
          >
            <div ref={chatEndRef} />

            {messageList?.map((item, index) => (
              <MessageItem
                key={index}
                message={item.content}
                isSender={item.sender === store.userId}
                isRead={item.seenBy.length > 0 ? true : false}
                time={new Date(item.createdAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              />
            ))}

            {!hasMore && messageList.length > 0 && (
              <div className="text-center py-4">
                <span className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm">
                  No more messages
                </span>
              </div>
            )}

            {loading && (
              <div className="flex justify-center py-4">
                <div className="bg-white rounded-lg px-4 py-2 shadow-md flex items-center space-x-2">
                  <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-700">Loading older messages...</span>
                </div>
              </div>
            )}
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
              {content.body && (
                <button type='submit' className="h-12 w-12 rounded-full flex justify-center items-center bg-[#4ABB81] cursor-pointer">
                  <CustomIcon name="material-symbols-light:send" className="text-white" />
                </button>
              )}
            </form>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center bg-gradient-to-b text-white">
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
        </div>
      )}
    </>
  )
}

export default MessageList