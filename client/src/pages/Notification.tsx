import axios from 'axios'
import { useEffect, useState } from 'react'
import CustomIcon from '../components/UI/CustomIcon'
import { CustomUserItem } from '../components/UI/CustomUserItem'
import { useToast } from '../context/ToastMessageProvider'

interface NotificationTypes {
    _id: string,
    senderId: string,
    message: string,
    seen: boolean,
    createdAt: string,
    updatedAt: string,
}

const Notification = () => {
    const [notificationList, setNotificationList] = useState<NotificationTypes[]>([])
    const { setToast } = useToast()

    const notifications = async () => {
        try {
            const { data } = await axios({
                url: "/api/user/notifications",
                method: "GET"
            })
            setNotificationList(data.notifications)
        } catch (error: any) {
            if (error) {
                setToast({ status: "Error", message: error.response.data.message })
            }
        }

    }

    useEffect(() => {
        notifications()
    }, [])
    return (
        <div className="flex-1 flex">
            <div className="h-full flex flex-col bg-white w-[50%] border-r-[2px] border-gray-200 p-1">
                <div className='flex items-center justify-between'>
                    <h1 className='font-semibold my-5 text-[#29D369]'>ConnectWave</h1>
                    <div className='flex items-center gap-1'>
                        <div className='h-10 w-10 hover:bg-[#EAE8E6] rounded-full flex justify-center items-center cursor-pointer'>
                            <CustomIcon name='qlementine-icons:menu-dots-16' />
                        </div>
                    </div>
                </div>
                <div className="my-5 flex items-center justify-between">
                    <div className="text-[#29D369]">All Notifications</div>
                    <div title='Remove All Notification' className="p-2 flex items-center bg-red-400 rounded-md gap-1.5 text-white font-semibold cursor-pointer">
                        <CustomIcon name="mdi:delete-off-outline" className="h-5 w-5" />
                    </div>
                </div>

                <div className='flex-1 w-full justify-center overflow-auto'>
                    {notificationList.map((item) => <NotificationItem key={item._id} data={item} />)}

                </div>
            </div>

            <div className="w-full h-full flex justify-center items-center bg-gradient-to-b text-white">
                <div className="flex flex-col justify-center items-center text-center space-y-6 p-8 rounded-2xl shadow-lg bg-[#F6F5F4] backdrop-blur-lg">
                    <img
                        src="/images/favicon.png"
                        alt="connectWave_logo"
                        className="w-32 h-32 mb-2 animate-bounce-slow"
                    />
                    <h1 className="text-3xl font-semibold text-[#29D369]">ConnectWave</h1>
                    <p className="text-lg max-w-md text-gray-500 leading-relaxed">
                        Connect with new people! View and manage your friend requests to grow your chat circle.
                    </p>
                </div>
            </div>

        </div>
    )
}

const NotificationItem = ({ data }: { data: NotificationTypes }) => {
    return <>
        <div
            className={`h-20 w-full hover:bg-[#F6F5F4] rounded-lg px-2 flex items-center gap-2 mb-[2px] relative`}
        >
            <div className='h-14 w-14 bg-[#29D369] text-white flex items-center justify-center rounded-full overflow-hidden'>
                <CustomIcon name="solar:user-linear" className="h-7 w-7" />
            </div>

            <div className='flex-1 h-full flex items-center  bg-red-50'>
                <div className='w'>
                    <h1 className=''>{`${data.message}`}</h1>
                    <h1 className=''>23-01-2025</h1>
                </div>
                {/* <div className='flex items-center gap-2'>
                    <>
                        <div className="p-2 flex items-center bg-[#29D369] rounded-md gap-1.5 text-white font-semibold cursor-pointer">
                            <CustomIcon name="material-symbols-light:chat-outline-rounded" className="h-5 w-5" />
                            <span>Chats</span>
                        </div>
                    </>
                </div> */}
            </div>
        </div>
    </>
}

export default Notification