import { useEffect, useRef } from "react";
import type { ContextMenuDataProps, CustomContextMenuProps } from "../../types/component"
import CustomIcon from "./CustomIcon";

interface Props {
  position: CustomContextMenuProps | null;
  onClose: () => void;
  data: ContextMenuDataProps[]
}

const CustomContextMenu = ({ position, onClose, data }: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (position) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [position, onClose]);

  if (!position) return null;
  return (

    <div ref={menuRef} onContextMenu={(e)=>e.preventDefault()} className='fixed w-60 rounded-lg right-[-30px] top-10 bg-white shadow-lg z-30' style={{ top: position?.y, left: position?.x }}>
      {data.map((item)=> <ContextItems data={item} />)}
    </div>
  )
}

const ContextItems = ({data}:{data: ContextMenuDataProps}) => {
  return(
    <div className="w-full h-14 p-3 flex items-center hover:bg-[#F6F5F4] cursor-pointer  gap-[1px] hover:bg-">
      <CustomIcon name={data.icon} className="text-lg w-7 h-7 text-gray-500" />
      <h1 className="text-base text-gray-500">{data.contextOption}</h1>
    </div>
  )
}

export default CustomContextMenu