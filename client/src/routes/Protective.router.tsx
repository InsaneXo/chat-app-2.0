import { SocketProvider } from '../context/SocketProvider'
import AppLayout from '../components/Layout/AppLayout'

const ProtectiveRouter = () => {
    return (
        <SocketProvider>
            <div className='h-screen w-screen bg-gradient-to-r from-[#FCF5EB] to-[#FFF8E1] flex '>
                <AppLayout/>
            </div>
        </SocketProvider>
    )
}

export default ProtectiveRouter