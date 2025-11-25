import axios from 'axios'
import { useEffect } from 'react'

const Notification = () => {

    const notifications = async () => {
        const { data } = await axios({
            url: "/api/user/notifications",
            method: "GET"
        })
    }

    useEffect(() => {
        notifications()
    }, [])
    return (
        <div>Notification</div>
    )
}

export default Notification