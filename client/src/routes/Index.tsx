import { Suspense, useContext, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AuthRouter from './Auth.router'
import ProtectiveRouter from './Protective.router'
import { useStore } from '../context/StoreProvider'
import axios from 'axios'
import { useToast } from '../context/ToastMessageProvider'

const Router = () => {
    const { store, setStore } = useStore()
    const { setToast } = useToast()

    const verifySession = async () => {
        try {
            if(!localStorage.getItem("token")) return

            const { data } = await axios({
                url: '/api/auth/session',
                method: "GET"
            })

            setStore({
                isAuthenticate: true,
                userEmail: data.email,
                userId: data.userId
            })

        } catch (error: any) {
            if (error) {
                setToast({
                    status: "Error",
                    message: error.response.data.message
                })
            }
        }
    }

    useEffect(() => {
        verifySession()
    }, [])
    return (
        <Suspense fallback={<div className="text-center py-10 text-xl">Loading...</div>}>
            <BrowserRouter>
                {store.isAuthenticate ? <ProtectiveRouter /> : <AuthRouter />}
            </BrowserRouter>
        </Suspense>
    )
}

export default Router