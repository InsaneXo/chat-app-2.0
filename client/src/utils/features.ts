
interface NotificationListenersType {
    data: any;
    type: string;
    listeners: any
}

const notificationEventHandler = ({ data, type, listeners }: NotificationListenersType) => {
    switch (type) {
        case "message":
            listeners(data)
            break;
        case "sendRequest":
            listeners(data)
            break;
        case "requestHandler":
            listeners(data)
            break;
        default:
            console.log("Invaild Type")
    }
}


export { notificationEventHandler }