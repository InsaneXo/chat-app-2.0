import React from 'react';
import CustomInputBox from '../../components/UI/CustomInputBox';

const ForgetPassword = () => {
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
            <h2 className="text-3xl font-bold text-gray-800">Reset your password!</h2>
            {/* <p className="text-gray-500 mt-2">Login to continue chatting</p> */}
          </div>

          <form className="space-y-5">
            <CustomInputBox label="Email" type='email' iconName='mdi:email-variant' iconClassName='absolute left-2 top-1/2 -translate-y-1/2 text-[#29D369]' />
            <button className="w-full h-12 bg-[#29D369] rounded-2xl text-white text-lg font-semibold hover:bg-green-500 transition-all duration-300">
              SEND OTP
            </button>
          </form>

          <div className="mt-6 text-center text-gray-500">
            Have an account?{' '}
            <span className="text-[#29D369] font-semibold cursor-pointer hover:underline">
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
