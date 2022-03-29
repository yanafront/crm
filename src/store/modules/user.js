import {
    GET_AUTH_USER_INFO,
    SET_AUTH_USER_INFO,
    SET_PRIMARY_CARD_ID,
    GET_DOWNLOADS_TOKEN
} from '../actions/user';
import api from '@/api.js';

export default {
    namespaced: true,
    state: {
        authUserData: null
    },
    getters: {
        getUserRole: state => state.authUserData?.role,
        getActiveSubscription: state => state.authUserData?.active_subscriptions || [],
        getCardId: state => state.authUserData?.card_id || null,
        getUserId: state => state.authUserData?.id,
        isProAccountMaually: state => state.authUserData?.is_manual_pro,
        getUniqueUrl :state => state.authUserData?.code
    },
    mutations: {
        [SET_AUTH_USER_INFO] (state, payload) {
            state.authUserData = payload;
            localStorage.setItem('stripe_pm', !!payload?.pm_type);
        },
        [SET_PRIMARY_CARD_ID] (state, payload) {
            state.authUserData.card_id = payload;
        }
    },
    actions: {
        [GET_AUTH_USER_INFO]({ commit }) {
            return new Promise((resolve, reject) => {
                api.get(`/api/user`)
                    .then(response => response.data)
                    .then(data => {
                        commit(SET_AUTH_USER_INFO, data.data);
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [GET_DOWNLOADS_TOKEN]({ commit }, params) {
            return new Promise((resolve, reject) => {
                api.get(`/api/downloads/token`, { params })
                    .then(response => {
                        resolve(response.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        }
    }
}
