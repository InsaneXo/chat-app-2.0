import CustomIcon from "./UI/CustomIcon";

interface MessageItem {
    message: string;
    time: string;
    isSender?: boolean;
    isRead?: boolean;
}

const MessageItem = ({
    message,
    time,
    isSender = false,
    isRead = false,
}: MessageItem) => {
    return (
        <div className={`flex w-full mb-2 ${isSender ? "justify-end" : "justify-start"}`}>
            <div
                className={`relative max-w-xs px-3 py-2 rounded-lg text-sm shadow-md flex flex-col
          ${isSender ? "bg-[#DCF8C6] text-black rounded-br-none" : "bg-white text-black rounded-bl-none border-[2px] border-gray-300"}
        `}
            >
                <div className="flex gap-2 h-full relative">
                    <div>{message}</div>
                    <div className="flex items-center justify-end mt-4">
                        <div className="text-[10px] text-gray-500">{time}</div>
                        {isSender && (
                            <CustomIcon name="hugeicons:tick-double-02" className={isRead ? "text-blue-500" : "text-gray-500"} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
