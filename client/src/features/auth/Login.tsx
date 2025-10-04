
import CustomInputBox from '../../components/UI/CustomInputBox';
import { useForm } from "react-hook-form";
import type { InputTypes } from '../../types/component';
import axios from 'axios';
import { useStore } from '../../context/StoreProvider';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastMessageProvider';
import { useEffect, useState } from 'react';

const Login = () => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<InputTypes>();
    const [loading, setLoading] = useState<boolean>(false)
    const [rememberMe, setRememberMe] = useState<boolean>(false)
    const { setStore } = useStore()
    const { setToast } = useToast()

    const loginHandler = async (formData: InputTypes) => {
        try {
            setLoading(true)
            const { data } = await axios({
                url: "/api/auth/login",
                method: "POST",
                data: {
                    email: formData.email,
                    password: formData.password
                }
            })
            setToast({ status: "Success", message: data.message })
            setStore({ isAuthenticate: true, userId: data.userId })
            localStorage.setItem("token", data.token)
            rememberMeHandler()
        } catch (error: any) {
            if (error) {
                setToast({ status: "Error", message: error.response.data.message })
            }
        }
        finally {
            setLoading(false)
        }
    }

    const rememberMeHandler = () => {
        if (rememberMe) {
            const value = watch()
            localStorage.setItem('userCredential', JSON.stringify({email: value.email, password: value.password}))
            return
        }
        localStorage.removeItem("userCredential")
    }

    useEffect(()=>{
        const getValue = localStorage.getItem("userCredential")
        if(getValue){
            const {email, password} = JSON.parse(getValue)
            setValue("email", email)
            setValue("password", password)
            setRememberMe(true)
        }
    },[])


    return (
        <div className="h-screen w-screen bg-gradient-to-r from-[#FCF5EB] to-[#FFF8E1] flex justify-center items-center">
            <div className="h-[90%] w-[90%] bg-white rounded-3xl shadow-2xl flex overflow-hidden max-w-5xl">
                {/* Left Image Section */}
                <div className="hidden md:block md:w-1/2 relative">
                    <img
                        className="h-full w-full object-cover"
                        src="/images/chatimage.jpg"
                        alt="Chat_Image"
                    />
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                </div>

                {/* Right Form Section */}
                <div className="flex-1 p-10 flex flex-col justify-center bg-white md:bg-gradient-to-br md:from-amber-50 md:to-amber-100">
                    <div className="mb-6 text-center">
                        <img
                            className="w-36 mx-auto mb-4"
                            src="/images/hero.png"
                            alt="Hero_Image"
                        />
                        <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
                        <p className="text-gray-500 mt-2">Login to continue chatting</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit(loginHandler)}>
                        <CustomInputBox label="Email" iconName='mdi:email-variant' iconClassName='absolute left-2 top-1/2 -translate-y-1/2 text-[#29D369] cursor-pointer' register={register("email", {
                            required: "Email is requried*", pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/,
                                message: "Invalid email address"
                            },
                        })} />
                        {errors.email && (
                            <p className="text-red-500 text-sm ">{errors.email.message}</p>
                        )}
                        <CustomInputBox label="Password" iconName='mdi:password-outline' iconClassName='absolute left-2 top-1/2 -translate-y-1/2 text-[#29D369]' action={true} register={register("password", { required: "Password is Requried*", })} />
                        {errors.password && (
                            <p className="text-red-500 text-sm ">{errors.password.message}</p>
                        )}
                        <div className='flex items-center justify-between '>
                            <div className='flex gap-1'>
                                <input type='checkbox' className=' cursor-pointer' checked={rememberMe} onChange={()=>setRememberMe(!rememberMe)} />
                                <div className='text-gray-500'>Remember Me</div>
                            </div>
                            <Link to={'/forget-password'} className="text-[#29D369] font-semibold cursor-pointer hover:underline">Forget Password?</Link>
                        </div>
                        <button disabled={loading} type='submit' className={`w-full h-12  ${loading ? "bg-green-300" : "bg-[#29D369]"}  rounded-2xl text-white text-lg font-semibold  transition-all duration-300 ${loading ? "cursor-not-allowed" : "cursor-pointer hover:bg-green-500"} `}>
                            Login
                        </button>
                    </form>

                    <div className="mt-6 text-center text-gray-500 ">
                        Don't have an account?{' '}
                        <Link to={"/register"} className="text-[#29D369] font-semibold cursor-pointer hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
