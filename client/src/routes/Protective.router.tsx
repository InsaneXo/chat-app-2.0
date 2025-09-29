import { Navigate, Route, Routes } from 'react-router-dom'
import MenuBar from '../components/MenuBar'
import ChatWindow from '../features/chat/ChatWindow'
import StatusWindow from '../features/status/StatusWindow'
import Settings from '../pages/Settings'
import Profile from '../pages/Profile'

const ProtectiveRouter = () => {
    return (
        <div className='h-screen w-screen bg-gradient-to-r from-[#FCF5EB] to-[#FFF8E1] flex '>
            <MenuBar />
            <Routes>
                <Route path='/' element={<Navigate to={'/chats'} replace />} />
                <Route path='/chats' element={<ChatWindow />} index />
                <Route path='/status' element={<StatusWindow />} />
                <Route path='/settings' element={<Settings />} />
                <Route path='/profile' element={<Profile/>} /> 
                <Route path='*' element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}

export default ProtectiveRouter