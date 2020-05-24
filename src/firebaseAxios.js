import axios from 'axios';

const firebaseAxios = axios.create({
    baseURL: 'https://enoikio-orbit2020.firebaseio.com/'
});

export default firebaseAxios;
