import ChatItem from "../components/ChatItem"
import CustomIcon from "../components/UI/CustomIcon"
import { CustomSearchBar } from "../components/UI/CustomSearchBar"

const Friends = () => {
    return (
        <div className="flex-1 flex">
            <div className="h-full flex flex-col bg-white w-[35%] border-r-[2px] border-gray-200 p-1">
                <div className='flex items-center justify-between'>
                    <h1 className='font-semibold my-5 text-[#29D369]'>ConnectWave</h1>
                    <div className='flex items-center gap-1'>
                        <div className='h-10 w-10 hover:bg-[#EAE8E6] rounded-full flex justify-center items-center cursor-pointer'>
                            <CustomIcon name='qlementine-icons:menu-dots-16' />
                        </div>
                    </div>
                </div>
                <CustomSearchBar />
                <div className="my-5 flex items-center justify-between">
                    <div className="text-[#29D369]">Friend Requests</div>
                    <div className="h-4 w-4 rounded-full bg-[#1DAA61] flex items-center justify-center  text-white text-[10px]">3</div>
                </div>

                <div className='flex-1 w-full overflow-auto'>
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                </div>
            </div>
            <div className="w-full h-screen flex flex-col bg-amber-300"></div>
        </div>

    )
}

export default Friends