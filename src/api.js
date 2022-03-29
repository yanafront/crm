import axios from 'axios';
import store from '@/store/index.js';
const token = localStorage.getItem('user-token');
const INCORRECT_CRED = 'The user credentials were incorrect.';

const api = axios.create({
    baseURL: process.env.VUE_APP_URL,
    headers: {
        Authorization: `Bearer ${token || ''}`
    },
    // responseType` indicates the type of data that the server will respond with
    // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
    // browser only: 'blob'
    responseType: 'json', // default

    // responseEncoding` indicates encoding to use for decoding responses
    // Note: Ignored for `responseType` of 'stream' or client-side requests
    responseEncoding: 'utf8', // default,
});

api.interceptors.response.use(
    (response) => { return response },
    (error) => {
        if (error.response && error.response.status === 401) {
            if (error.response?.data?.meta?.error_message == INCORRECT_CRED) {
                store.commit('auth/AUTH_LOGOUT', false);
            } else {
                store.commit('auth/AUTH_LOGOUT', true);
            }

            store.commit('cards/RESET_COLOR_THEME', 0);
            store.commit('cards/REMOVE_CARD_INFO', []);
            store.commit('cards/REMOVE_PUBLIC_CARD_INFO', {});
        }

        return Promise.reject(error);
    }
);

export default api;
