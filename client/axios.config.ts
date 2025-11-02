import Axios from "axios";
const NODE_ENV = import.meta.env.VITE_NODE_ENV
if (NODE_ENV === 'DEV')
    Axios.defaults.baseURL = import.meta.env.VITE_API_URL;
Axios.defaults.headers.post['Content-Type'] = 'application/json';
Axios.interceptors.request.use(async (request) => {
    const token = localStorage.getItem('token')
    if (token)
        request.headers['token'] = token
    return request;
}, error => {
    return Promise.reject(error);
});

Axios.interceptors.response.use(response => {

    return response
}, error => {
    return Promise.reject(error);
});
