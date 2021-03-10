import axios from 'axios';

const api = axios.create({
	baseURL: 'https://192.168.0.17:3333/',
	headers: {
        'Access-Control-Allow-Origin': true,
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',   
    }
});

export default api;