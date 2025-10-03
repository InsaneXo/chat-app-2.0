import React, { useState } from 'react';
import CustomInputBox from '../../components/UI/CustomInputBox';
import { Controller, useForm } from 'react-hook-form';
import type { InputTypes } from '../../types/component';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import OTPInput from '../../components/UI/OTPInput';
import { useToast } from '../../context/ToastMessageProvider';



interface FormTypes {
  formType: string,
  btnName: string
}

const ForgetPassword = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<InputTypes>();
  const [form, setForm] = useState<FormTypes>({
    formType: "forgetPass",
    btnName: "Send OTP"
  })
  const [token, setToken] = useState<string>("")
  const navigate = useNavigate()
  const { setToast } = useToast()

  const handleSubmitForm = (formData: InputTypes) => {

    if (form.formType === "forgetPass") {
      return handleForgetPassword(formData)
    }
    else if (form.formType === "otp") {
      return verifyOtpHandler(formData)
    }
    else {
      newPasswordHandler(formData)
    }
  }

  const handleForgetPassword = async (formData: InputTypes) => {
    try {
      console.log("formData : ", formData)
      const { data } = await axios({
        url: '/api/auth/forget-password',
        method: "POST",
        data: {
          email: formData.email
        }
      })
      setForm({ formType: "otp", btnName: "Verify OTP" })
      setToken(data.token)
      setToast({ status: "Success", message: data.message })
    } catch (error: any) {
      if (error) {
        setToast({ status: "Error", message: error.response.data.message })
      }
    }
  }

  const verifyOtpHandler = async (formData: InputTypes) => {
    try {
      const { data } = await axios({
        url: "/api/auth/verify-forget-password",
        method: "POST",
        data: {
          token,
          otp: formData.otp
        }
      })
       setForm({ formType: "newPassword", btnName: "Save Password" })
      setToast({ status: "Success", message: data.message })
    } catch (error: any) {
      if (error) {
        setToast({ status: "Error", message: error.response.data.message })
      }
    }
  }

  const newPasswordHandler = async (formData: InputTypes) => {
    try {
      if (formData.newPassword !== formData.confirmPassword) {
        return setToast({ status: "Error", message: "New Password and Confirm Password is not match" })
      }

      const { data } = await axios({
        url: "/api/auth/new-password",
        method: "POST",
        data: {
          token,
          newPassword: formData.newPassword
        }
      })
      setToast({ status: "Success", message: data.message })
      navigate("/")
    } catch (error: any) {
      if (error) {
        setToast({ status: "Error", message: error.response.data.message })
      }
    }
  }
  return (
    <div className="h-screen w-screen bg-gradient-to-r from-[#FCF5EB] to-[#FFF8E1] flex justify-center items-center">
      <div className="h-[90%] w-[90%] bg-white rounded-3xl shadow-2xl flex overflow-hidden max-w-5xl">
        <div className="hidden md:block md:w-1/2 relative">
          <img
            className="h-full w-full object-cover"
            src="/images/chatimage.jpg"
            alt="Chat_Image"
          />
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>

        <div className="flex-1 p-10 flex flex-col justify-center bg-white md:bg-gradient-to-br md:from-amber-50 md:to-amber-100">
          <div className="mb-6 text-center">
            <img
              className="w-36 mx-auto mb-4"
              src="/images/hero.png"
              alt="Hero_Image"
            />
            <h2 className="text-3xl font-bold text-gray-800">Reset your password!</h2>
            <p className="text-gray-500 mt-2">Forget your Password</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(handleSubmitForm)}>
            {form.formType === "forgetPass" &&
              <>
                <CustomInputBox label="Email" iconName='mdi:email-variant' iconClassName='absolute left-2 top-1/2 -translate-y-1/2 text-[#29D369]' register={register("email", {
                  required: "Email are requried*", pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/,
                    message: "Invalid email address"
                  },
                })} />
                {errors.email && (
                  <p className="text-red-500 text-sm ">{errors.email.message}</p>
                )}
              </>}

            {form.formType === "otp" && <>
              <Controller
                control={control}
                name="otp"
                rules={{ required: "OTP is required", minLength: { value: 6, message: "OTP must be 6 digits" } }}
                render={({ field: { value, onChange } }) => (
                  <OTPInput length={6} value={value} onChange={onChange} />
                )}
              />
            </>}

            {form.formType === "newPassword" && <>
              <CustomInputBox label="New Password" iconName='mdi:password-outline' iconClassName='absolute left-2 top-1/2 -translate-y-1/2 text-[#29D369]' action={true} register={register("newPassword", {
                required: "New Password is Requried*",
              })} />
              {errors.newPassword && (
                <p className="text-red-500 text-sm ">{errors.newPassword.message}</p>
              )}
              <CustomInputBox label="Confirm Password" iconName='mdi:password-outline' iconClassName='absolute left-2 top-1/2 -translate-y-1/2 text-[#29D369]' action={true} register={register("confirmPassword", {
                required: "Confirm Password is Requried*",
              })} />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm ">{errors.confirmPassword.message}</p>
              )}
            </>}

            <button type='submit' className="w-full h-12 bg-[#29D369] rounded-2xl text-white text-lg font-semibold hover:bg-green-500 transition-all duration-300 cursor-pointer">
              {form.btnName}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-500">
            Don't Have an account?{' '}
            <Link to={"/register"} className="text-[#29D369] font-semibold cursor-pointer hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
