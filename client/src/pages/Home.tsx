import React from 'react'
import MenuBar from '../components/MenuBar'
import ChatWindow from '../features/chat/ChatWindow'

const Home = () => {
    return (
        <div className='h-screen w-screen bg-gradient-to-r from-[#FCF5EB] to-[#FFF8E1] flex '>
            <MenuBar />
            <ChatWindow/>
        </div>
    )
}

export default Home