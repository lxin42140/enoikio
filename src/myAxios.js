import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://enoikio-orbit2020.firebaseio.com/'
});

export default instance;