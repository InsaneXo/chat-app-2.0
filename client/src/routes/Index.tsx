import { Suspense, useContext, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AuthRouter from './Auth.router'
import ProtectiveRouter from './Protective.router'
import { useStore } from '../context/StoreProvider'
import axios from 'axios'

const Router = () => {
    const { store, setStore } = useStore()

    const hello = async () => {
        await axios({
            url: '/api/auth/login2',
            method: "GET"
        })
    }

    useEffect(() => {
        hello()

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