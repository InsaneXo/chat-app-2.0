import { useNavigate } from "react-router-dom";
import CustomIcon from "./CustomIcon";

interface UserType {
    _id: string;
    name: string;
    loginId: string;
    senderId: string
    email: string;
    avatar?: string;
    status?: string;
    requestId: string;
}
interface CustomUserItemProps {
    user: UserType;
    loginId: string;
    isSearch: boolean;
    handler: (_id: string, type: string) => void
}

export const CustomUserItem = ({ user, isSearch, loginId, handler }: CustomUserItemProps) => {
    const navigation = useNavigate()

    const styling = {
        bgColor: user.status === "not_friends" ? "bg-[#29D369]" : "bg-red-500",
        cursor: user.status === "not_friends" && "cursor-pointer",
        buttonFont: user.status === "not_friends" ? "Send Friend" : "Pending"
    }

    return (
        <>
            <div
                className={`h-20 w-full hover:bg-[#F6F5F4] rounded-lg px-2 flex items-center gap-2 mb-[2px] relative`}
            >
                <div className='h-14 w-14 bg-[#29D369] text-white flex items-center justify-center rounded-full overflow-hidden'>
                    {user.avatar ? (
                        <img src={user.avatar} alt="user_avatar" className="h-full w-full object-cover" />
                    ) : (
                        <CustomIcon name="solar:user-linear" className="h-7 w-7" />
                    )}
                </div>

                <div className='flex-1 flex justify-between items-center'>
                    <div>
                        <h1 className='font-medium'>{user.name}</h1>
                        <p className='font-light text-[13px] text-gray-400'>{user.email}</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        {isSearch ? (
                            <>
                                {!user.senderId && (
                                    <div
                                        className={`p-2 flex items-center ${styling.bgColor} ${styling.cursor} rounded-md gap-1.5 text-white font-semibold`}
                                        onClick={() => user.status === "not_friends" && handler(user._id, "sendRequest")}
                                    >
                                        <CustomIcon name={user.status === "pending" ? 'tabler:clock' : 'iconoir:add-user'} className="h-5 w-5" />
                                        <span>{styling.buttonFont}</span>
                                    </div>
                                )}

                                {user.senderId === loginId && (
                                    <div
                                        className={`p-2 flex items-center ${user.status === "accepted" ? "bg-[#29D369] cursor-pointer" : "bg-red-500"} rounded-md gap-1.5 text-white font-semibold `}
                                        onClick={() => user.status === "accepted" && navigation('/chats')}
                                    >
                                        <CustomIcon name={user.status === "accepted" ? "material-symbols-light:chat-outline-rounded" : "tabler:clock"} className="h-5 w-5" />
                                        <span>{user.status === "accepted" ? "Chat" : "Pending"}</span>
                                    </div>
                                )}

                                {user.senderId && user.senderId !== loginId && (
                                    <>
                                        {user.status === "accepted" ? <div
                                            className={`p-2 flex items-center ${user.status === "accepted" ? "bg-[#29D369] cursor-pointer" : "bg-red-500"} rounded-md gap-1.5 text-white font-semibold `}
                                            onClick={() => user.status === "accepted" && navigation('/chats')}
                                        >
                                            <CustomIcon name={user.status === "accepted" ? "material-symbols-light:chat-outline-rounded" : "tabler:clock"} className="h-5 w-5" />
                                            <span>{user.status === "accepted" ? "Chat" : "Pending"}</span>
                                        </div> : <>
                                            <div
                                                className="p-2 flex items-center bg-red-400 rounded-md gap-1.5 text-white font-semibold cursor-pointer"
                                                onClick={() => handler(user?.requestId, "rejected")}
                                            >
                                                <CustomIcon name="basil:cross-outline" className="h-5 w-5" />
                                                <span>Reject</span>
                                            </div>

                                            <div
                                                className="p-2 flex items-center bg-[#29D369] rounded-md gap-1.5 text-white font-semibold cursor-pointer"
                                                onClick={() => handler(user?.requestId, "accepted")}
                                            >
                                                <CustomIcon name="teenyicons:tick-small-outline" className="h-5 w-5" />
                                                <span>Accept</span>
                                            </div>
                                        </>}
                                    </>

                                )}
                            </>
                        ) : <>
                            <div className="p-2 flex items-center bg-red-400 rounded-md gap-1.5 text-white font-semibold cursor-pointer" onClick={() => handler(user?._id, "rejected")}>
                                <CustomIcon name="basil:cross-outline" className="h-5 w-5" />
                                <span>Reject</span>
                            </div>
                            <div className="p-2 flex items-center bg-[#29D369] rounded-md gap-1.5 text-white font-semibold cursor-pointer" onClick={() => handler(user?._id, "accepted")}>
                                <CustomIcon name="teenyicons:tick-small-outline" className="h-5 w-5" />
                                <span>Accept</span>
                            </div>
                        </>}
                    </div>
                </div>
            </div>
        </>
    );
};
