import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import ForgetPassword from '../features/auth/ForgetPassword';

const AuthRouter = () => {
    return (
        <Routes>
            <Route index element={<Login />} />
            <Route path='/register' index element={<Register />} />
            <Route path='/forget-password' element={<ForgetPassword />} />
            <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default AuthRouter