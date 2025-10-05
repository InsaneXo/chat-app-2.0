import { Link, useLocation } from 'react-router-dom'
import CustomIcon from './UI/CustomIcon'

const MenuBar = () => {
  const location = useLocation();

  const getLinkClasses = (path: string) => {
    const isActive = location.pathname === path;
    return `h-10 w-10 rounded-full flex justify-center relative items-center mb-2 cursor-pointer
      ${isActive ? 'bg-[#1DAA61] text-white' : 'hover:bg-[#EAE8E6] bg-[#EAE8E6]'}`;
  };

  return (
    <div className='h-full w-16 bg-[#F7F5F3] border-r-[2px] border-gray-200 p-2 flex flex-col justify-between'>
      <div className='border-b-[2px] border-gray-200'>
        <Link to="/chats" className={getLinkClasses('/chats')}>
          <CustomIcon name='mdi:chat-bubble' />
          <div className='h-4 w-4 bg-[#1DAA61] rounded-full flex justify-center items-center text-white text-[10px] absolute right-0 top-[-4px] border-2 border-[#F7F5F3]'>
            3
          </div>
        </Link>

        <Link to="/status" className={getLinkClasses('/status')}>
          <CustomIcon name='majesticons:chat-status' />
        </Link>

         <Link to="/friends" className={getLinkClasses('/friends')}>
          <CustomIcon name='fa7-solid:user-friends' />
        </Link>
      </div>

      <div>
        <Link to="/settings" className={getLinkClasses('/settings')}>
          <CustomIcon name='lets-icons:setting-fill' />
        </Link>

        <Link to="/profile" className={getLinkClasses('/profile')}>
          <div className='h-8 w-8 rounded-full bg-amber-100'></div>
        </Link>
      </div>
    </div>
  )
}

export default MenuBar
