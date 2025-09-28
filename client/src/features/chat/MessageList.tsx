import React from 'react'
import CustomIcon from '../../components/UI/CustomIcon'
import MessageItem from '../../components/MessageItem'

const MessageList = () => {
  return (
    <div className="w-full h-screen flex flex-col bg-[url('/images/chatwindowimage.jpg')] ">
      {/* Header */}
      <div className="w-full h-16 bg-white flex items-center justify-between border-b border-gray-200 px-3">
        <div className="flex items-center gap-2">
          <div className="h-12 w-12 bg-amber-300 rounded-full"></div>
          <h1 className="">Bipin Singh</h1>
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
        {Array(15).fill(0).map((_, i) => (
          <MessageItem
            key={i}
            message={i % 2 === 0 ? 'Hello World how are you ' : 'Hello Bipin'}
            isSender={i % 2 === 0}
            isRead={true}
            time="10:00 am"
          />
        ))}
      </div>


      {/* Input Bar */}
      <div className="w-[97%] m-auto my-2 h-16 bg-white flex items-center gap-2 px-4 border-[1px] rounded-full border-gray-300 shadow-md">
        <div className="h-10 w-10 hover:bg-[#EAE8E6] rounded-full flex justify-center items-center cursor-pointer">
          <CustomIcon name="material-symbols:add-rounded" />
        </div>
        <div className="h-10 w-10 hover:bg-[#EAE8E6] rounded-full flex justify-center items-center cursor-pointer">
          <CustomIcon name="weui:sticker-outlined" />
        </div>
        <input
          className="flex-1 h-full border-none outline-none px-3"
          type="text"
          placeholder="Enter a message"
        />
        <div className="h-12 w-12 rounded-full flex justify-center items-center bg-[#4ABB81] cursor-pointer">
          <CustomIcon name="material-symbols-light:send" className="text-white" />
        </div>
      </div>
    </div>
  )
}

export default MessageList
