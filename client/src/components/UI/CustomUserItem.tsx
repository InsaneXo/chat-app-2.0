import { useState } from "react";
import type { ContextMenuDataProps, CustomContextMenuProps } from "../../types/component";
import CustomContextMenu from "./CustomContextMenu";
import CustomIcon from "./CustomIcon";

interface UserType {
    _id: string;
    name: string;
    senderId: string
    email: string;
    avatar?: string;
    status?: string
}
interface CustomUserItemProps {
    contextMenuActive: boolean;
    user: UserType;
    onContextMenuData?: ContextMenuDataProps[];
    isSearch: boolean;
    handler: (_id: string, type: string) => void
}

export const CustomUserItem = ({ contextMenuActive, user, onContextMenuData, isSearch, handler }: CustomUserItemProps) => {
    const [position, setPosition] = useState<CustomContextMenuProps | null>(null);

    const handleClose = () => setPosition(null);

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!contextMenuActive) return;
        setPosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <>
            <div
                className={`h-20 w-full hover:bg-[#F6F5F4] rounded-lg px-2 flex items-center gap-2 mb-[2px] ${contextMenuActive ? 'cursor-pointer' : ''} relative`}
                onContextMenu={handleContextMenu}
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
                            <div
                                className={`p-2 flex items-center bg-[#29D369] rounded-md gap-1.5 text-white font-semibold ${user.status ===
                                    "not_friends" && "cursor-pointer"}`}
                                // sendRequest
                                onClick={() => user.status === "not_friends" &&
                                    handler(user._id, "sendRequest")
                                }
                            >
                                <CustomIcon name={user.status === "not_friends" ? "iconoir:add-user" : "tabler:clock"} className="h-5 w-5" />
                                <span>{user.status === "not_friends" ? "Send Friend" : "Pending"}</span>
                            </div>
                        ) : (
                            <>
                                <div className="p-2 flex items-center bg-red-400 rounded-md gap-1.5 text-white font-semibold cursor-pointer" onClick={() => handler(user?._id, "rejected")}>
                                    <CustomIcon name="basil:cross-outline" className="h-5 w-5" />
                                    <span>Reject</span>
                                </div>
                                <div className="p-2 flex items-center bg-[#29D369] rounded-md gap-1.5 text-white font-semibold cursor-pointer" onClick={() => handler(user?._id, "accepted")}>
                                    <CustomIcon name="teenyicons:tick-small-outline" className="h-5 w-5" />
                                    <span>Accept</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {position && contextMenuActive && (
                <CustomContextMenu position={position} onClose={handleClose} data={onContextMenuData} />
            )}
        </>
    );
};
