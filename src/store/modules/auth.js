import {
    AUTH_SIGNUP,
    AUTH_LOGIN,
    AUTH_REQUEST,
    AUTH_ERROR,
    AUTH_SUCCESS,
    AUTH_LOGOUT,
    FORGOT_PASSWORD,
    RESET_PASSWORD,
    CHECK_VERIFIED_USER,
    USER_EMAIL_UNVERIFIED,
    RESEND_VERIFICATION_EMAIL
} from '../actions/auth';
import api from '@/api.js';
import router from '@/router/index';

export default {
    namespaced: true,
    state: {
        token: localStorage.getItem('user-token') || '',
        refresh_token: '',
        status: '',
        email: ''
    },
    getters: {
        isAuth: state => {
            try {
                return !!state.token;
            } catch (e) {
                // throws InvalidTokenError exception
                state.status = 'logout';
                state.token = '';
                state.refresh_token = '';
                localStorage.removeItem('user-token');
                localStorage.removeItem('user-email');
                return false;
            }
        },
        userAuthEmail: state => state.email,
    },
    mutations: {
        [AUTH_REQUEST] (state, payload) {
            state.status = payload;
        },
        [AUTH_SUCCESS] (state, payload) {
            state.status = 'success';
            state.token = payload.access_token;
            state.refresh_token = payload.refresh_token;
            api.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem('user-token')|| ''}`;
        },
        [AUTH_ERROR] (state) {
            state.status = 'error';
            state.token = '';
        },
        [AUTH_LOGOUT] (state, payload) {
            state.status = 'logout';
            state.token = '';
            state.refresh_token = '';
            localStorage.removeItem('user-token');
            localStorage.removeItem('user-email');
            localStorage.removeItem('stripe_pm');
            localStorage.removeItem('startSubscription');
            localStorage.removeItem('darkMode');

            if (payload) {
                router.push({ name: 'PreAuth' });
            } else {
                router.push({ name: 'Login' });
            }
        },
        [FORGOT_PASSWORD] (state, payload) {
            state.status = 'forgot password';
            state.token = '';
            state.refresh_token = '';
            state.email = payload;
        },
        [RESET_PASSWORD] (state) {
            state.status = 'reset password';
            state.token = '';
        },
        [USER_EMAIL_UNVERIFIED] (state, payload) {
            state.status = 'email_unverified';
            state.token = '';
            state.refresh_token = '';
            localStorage.removeItem('user-token');
            localStorage.setItem('user-email', payload.email);
        }
    },
    actions: {
        [AUTH_SIGNUP]({ commit }, data) {
            return new Promise((resolve, reject) => {
                commit(AUTH_REQUEST, 'loading');
                api.post('/api/register', data)
                    .then(response => response.data)
                    .then(resp => {
                        commit(AUTH_REQUEST, '');
                        resolve(resp.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [AUTH_LOGIN]({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit(AUTH_REQUEST, 'loading');
                api.post('/oauth/token', user)
                    .then(response => response.data)
                    .then(data => {
                        commit(AUTH_REQUEST, '');
                        localStorage.setItem('user-token', data.access_token);
                        commit(AUTH_SUCCESS, data);
                        resolve(data);
                    })
                    .catch(error => {
                        commit(AUTH_LOGOUT, false);
                        reject(error);
                    });
            })
        },
        [FORGOT_PASSWORD]({ commit }, email) {
            return new Promise((resolve, reject) => {
                commit(FORGOT_PASSWORD, email.email);
                api.post('/api/send-reset-password', email)
                    .then(response => {
                        resolve(response.data.data);
                    })
                    .catch(error => {
                        commit(AUTH_ERROR);
                        reject(error);
                    });
            })
        },
        [RESET_PASSWORD]({ commit }, formData) {
            return new Promise((resolve, reject) => {
                commit(RESET_PASSWORD);
                api.post(`/api/reset-password`, formData)
                    .then(response => {
                        resolve(response.data.data);
                    })
                    .catch(error => {
                        commit(AUTH_ERROR);
                        reject(error);
                    });
            })
        },
        [CHECK_VERIFIED_USER]({ commit }) {
            return new Promise((resolve, reject) => {
                api.get(`/api/user`)
                    .then(response => {
                        const responseData = response.data.data;
                        if (!responseData.email_verified_at) {
                            commit(USER_EMAIL_UNVERIFIED, responseData);
                        }

                        resolve(responseData);
                    })
                    .catch(error => {
                        commit(AUTH_ERROR);
                        reject(error);
                    });
            })
        },
        [RESEND_VERIFICATION_EMAIL]({ commit }) {
            const userId = {
                email: localStorage.getItem('user-email') || ''
            };

            return new Promise((resolve, reject) => {
                api.post(`/api/send-verification-mail`, userId)
                    .then(response => {
                        resolve(response.data.data);
                    })
                    .catch(error => {
                        commit(AUTH_ERROR);
                        reject(error);
                    });
            })
        }
    }
}
