import axios from 'axios';

// specifies the base url to make requests from
// in one place
const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000', // change this for prod
});

export default instance;
