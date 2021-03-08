import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:3333/',
    withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin': true,
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',   
    }
});

export default api;