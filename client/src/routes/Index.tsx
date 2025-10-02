import { Suspense, useContext } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AuthRouter from './Auth.router'
import ProtectiveRouter from './Protective.router'
import { useStore } from '../context/StoreProvider'

const Router = () => {
    const {store, setStore} = useStore()
    return (
        <Suspense fallback={<div className="text-center py-10 text-xl">Loading...</div>}>
            <BrowserRouter>
            {store.isAuthenticate ? <ProtectiveRouter /> :  <AuthRouter />}
            </BrowserRouter>
        </Suspense>
    )
}

export default Router