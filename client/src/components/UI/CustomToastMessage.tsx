import { useEffect } from 'react'
import CustomIcon from './CustomIcon'
import type { CustomToastMessageProps } from '../../types/component'
import { useToast } from '../../context/ToastMessageProvider'

const CustomToastMessage = ({ data }: CustomToastMessageProps) => {
    const { setToast } = useToast()
    let timer: any

    const onCloseHandler = () => {
        setToast({ status: "", message: "" })
        clearTimeout(timer)
    }

    useEffect(() => {
        if (data.status) {
            timer = setTimeout(() => {
                setToast({
                    status: "",
                    message: ""
                })
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [data.status])

    return (
        <div
            className={`fixed z-50 w-11/12 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-16 rounded-md bg-white flex items-center overflow-hidden left-1/2 -translate-x-1/2
    transition-all duration-500 ease-in-out shadow-lg
    ${data.status ? 'top-5 opacity-100' : '-top-20 opacity-0'}`}
        >
            <div className={`h-full ${data.status === "Success" ? 'bg-green-500' : 'bg-red-500'} w-2`}></div>
            <div className="flex-1 flex items-center h-full px-3">
                <CustomIcon
                    name={data.status === "Success" ? "ix:success-filled" : "ix:namur-failure-filled"}
                    className={`mr-3 h-7 w-7 text-xl ${data.status === "Success" ? "text-green-500" : "text-red-500"}`}
                />
                <div className="flex flex-col justify-center">
                    <span className={`font-semibold ${data.status === "Success" ? 'text-green-500' : 'text-red-500'}`}>
                        {data.status}
                    </span>
                    <p className="text-[12px] sm:text-sm text-gray-500 truncate">
                        {data.message}
                    </p>
                </div>
            </div>
            <div className="h-full w-8 flex justify-center cursor-pointer" onClick={onCloseHandler}>
                <CustomIcon
                    name="basil:cross-outline"
                    className="h-7 w-7 text-xl text-gray-400 hover:text-gray-600 transition-colors"
                />
            </div>
        </div>

    )
}

export default CustomToastMessage
