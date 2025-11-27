import axios from 'axios'
import { useEffect, useState } from 'react'
import CustomIcon from '../components/UI/CustomIcon'
import { CustomUserItem } from '../components/UI/CustomUserItem'
import { useToast } from '../context/ToastMessageProvider'
import { useStore } from '../context/StoreProvider'

interface NotificationTypes {
    _id: string,
    senderId: string,
    message: string,
    seen: boolean,
    createdAt: string,
    updatedAt: string,
}

function convertToHumanReadable(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}


const Notification = () => {
    const { setToast } = useToast()
    const { notification, setNotification } = useStore()

    const notifications = async () => {
        try {
            const { data } = await axios({
                url: "/api/user/notifications",
                method: "GET"
            })
            setNotification((prev) => ({
                ...prev,
                otherNotification: data.notifications
            }))
        } catch (error: any) {
            if (error) {
                setToast({ status: "Error", message: error.response.data.message })
            }
        }

    }

    const hideMessageHandler = async (notificationId: string, hideAll = false) => {
        try {
            await axios({
                url: "/api/user/notifications",
                method: "DELETE",
                data: {
                    notificationId,
                    hideAll
                }
            })

            if (hideAll) {
                return setNotification((prev) => ({
                    ...prev,
                    otherNotification: []
                }))
            }

            setNotification((prev) => ({
                ...prev,
                otherNotification: prev.otherNotification.filter((notification) => notification._id !== notificationId)
            }))

        } catch (error: any) {
            if (error) {
                if (error) {
                    setToast({ status: "Error", message: error.response.data.message })
                }
            }
        }
    }

    const checkAllNotificationSeen = async () => {
        try {
            await axios({
                url: "/api/user/notifications",
                method: "PUT",
            })

            setNotification((prev) => ({
                ...prev,
                freshNotification: 0
            }))
        } catch (error: any) {
            if (error) {
                if (error) {
                    setToast({ status: "Error", message: error.response.data.message })
                }
            }
        }
    }

    useEffect(() => {
        notifications()
        if (notification.otherNotification.length > 0) {
            checkAllNotificationSeen()
        }
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
                <div className="my-5 flex justify-between">
                    <div className="text-[#29D369] font-medium">All Notifications</div>
                    {notification.otherNotification && notification.otherNotification.length > 0 && <div title='Remove All Notification' className="p-2 flex items-center bg-red-400 rounded-md gap-1.5 text-white font-semibold cursor-pointer" onClick={() => hideMessageHandler("", true)}>
                        <CustomIcon name="mdi:hide" className="h-5 w-5" />
                        <span>Hide All</span>
                    </div>}

                </div>

                <div className='flex-1 w-full justify-center overflow-auto'>
                    {notification.otherNotification && notification.otherNotification.length > 0 ? notification.otherNotification && notification.otherNotification.map((data) => <NotificationItem key={data._id} data={data} hideMessageHandler={hideMessageHandler} />) : <div className="bg-white rounded-lg px-4 py-2 shadow-md flex items-center space-x-2 mt-5 w-80 mx-auto">
                        <span className="text-gray-700">There are no new notification here.</span>
                    </div>}
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
                        Connect with new people! View and manage your notification here.
                    </p>
                </div>
            </div>

        </div>
    )
}

const NotificationItem = ({ data, hideMessageHandler }: { data: NotificationTypes, hideMessageHandler: (notificationId: string) => void }) => {
    return <>
        <div
            className={`h-20 w-full hover:bg-[#F6F5F4] rounded-lg px-2 flex items-center gap-2 mb-[2px] relative`}
        >
            <div className='h-14 w-14 bg-[#29D369] text-white flex items-center justify-center rounded-full overflow-hidden'>
                <CustomIcon name="solar:user-linear" className="h-7 w-7" />
            </div>

            <div className='flex-1 h-full flex items-center justify-between'>
                <div className=''>
                    <h1 className=''>{`${data.message}`}</h1>
                    <h1 className='font-light text-[13px] text-gray-400'>{convertToHumanReadable(data.createdAt)}</h1>
                </div>
                <div className='flex items-center gap-2'>
                    <div className="p-2 flex items-center bg-[#29D369] rounded-md gap-1.5 text-white font-semibold cursor-pointer" onClick={() => hideMessageHandler(data._id)}>
                        <CustomIcon name="mdi:hide" className="h-5 w-5" />
                        <span>Hide</span>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Notification