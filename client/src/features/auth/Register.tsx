import { useState } from 'react';
import CustomInputBox from '../../components/UI/CustomInputBox';
import type { InputTypes } from '../../types/component';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import OTPInput from '../../components/UI/OTPInput';
import { useToast } from '../../context/ToastMessageProvider';

const Register = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm<InputTypes>();
    const { setToast } = useToast()
    const [formType, setFormType] = useState<string>("register")
    const [token, setToken] = useState<string>("")
    const navigate = useNavigate()

    const handleRegister = async (formData: InputTypes) => {
        try {
            const { data } = await axios({
                url: "/api/auth/register",
                method: "POST",
                data: {
                    email: formData.email,
                    name: formData.name,
                    password: formData.password
                }
            })
            setToast({ status: "Success", message: data.message })
            setToken(data.token)
            setFormType("verifyotp")
        } catch (error: any) {
            setToast({ status: "Error", message: "Something went wrong" })
        }
    }

    const handleVerifyOTP = async (formData: InputTypes) => {
        try {
            const { data } = await axios({
                url: "/api/auth/verify-otp",
                method: "POST",
                data: {
                    token,
                    otp: formData.otp
                }
            })
            setToast({ status: "Success", message: data.message })
            navigate('/')
        } catch (error) {
            setToast({ status: "Error", message: "Something went wrong" })
        }
    }

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
                        <p className="text-gray-500 mt-2">{formType === "register" ? "Register to continue chatting" : "Enter your OTP to continue"}</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit(formType === "register" ? handleRegister : handleVerifyOTP)}>
                        {formType === "register" ? <>
                            <CustomInputBox label="Email" iconName='mdi:email-variant' iconClassName='absolute left-2 top-1/2 -translate-y-1/2 text-[#29D369]' register={register("email", {
                                required: "Email is requried*", pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/,
                                    message: "Invalid email address"
                                }
                            })} />
                            {errors.email && (
                                <p className="text-red-500 text-sm ">{errors.email.message}</p>
                            )}
                            <CustomInputBox label="Name" iconName='mdi:user' iconClassName='absolute left-2 top-1/2 -translate-y-1/2 text-[#29D369]' register={register("name", {
                                required: "Name is Requried*"
                            })} />
                            {errors.name && (
                                <p className="text-red-500 text-sm ">{errors.name.message}</p>
                            )}
                            <CustomInputBox label="Password" iconName='mdi:password-outline' iconClassName='absolute left-2 top-1/2 -translate-y-1/2 text-[#29D369]' action={true} register={register("password", {
                                required: "Password is Requried*",
                            })} />
                            {errors.password && (
                                <p className="text-red-500 text-sm ">{errors.password.message}</p>
                            )}
                        </> : <Controller
                            control={control}
                            name="otp"
                            rules={{ required: "OTP is required", minLength: { value: 6, message: "OTP must be 6 digits" } }}
                            render={({ field: { value, onChange } }) => (
                                <OTPInput length={6} value={value} onChange={onChange} />
                            )}
                        />}
                        <button className="w-full h-12 bg-[#29D369] rounded-2xl text-white text-lg font-semibold hover:bg-green-500 transition-all duration-300 cursor-pointer">
                            {formType === "register" ? "Register" : "Verify OTP"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-gray-500">
                        Have an account?{' '}
                        <Link to={"/"} className="text-[#29D369] font-semibold cursor-pointer hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Register;
