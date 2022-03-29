import {
    GET_BASIC_ANALYTICS_BY_AUTH_USER,
    GET_ADVANCED_ANALYTICS_BY_AUTH_USER,
    GET_ADVANCED_ANALYTICS_LOG,
    SAVE_ACTION,
    SET_DEVICE_ID
} from '../actions/analytics';
import api from '@/api.js';

export default {
    namespaced: true,
    state: {
        deviceId: null
    },
    getters: {
        getDeviceId: state => state.deviceId
    },
    mutations: {
        [SET_DEVICE_ID] (state, payload) {
            state.deviceId = payload;
        },
    },
    actions: {
        [GET_BASIC_ANALYTICS_BY_AUTH_USER]() {
            return new Promise((resolve, reject) => {
                api.get('/api/analytics/basic')
                    .then(response => response.data)
                    .then(data => {
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        [GET_ADVANCED_ANALYTICS_BY_AUTH_USER]({}, params) {
            return new Promise((resolve, reject) => {
                api.get('/api/analytics/extended', params)
                    .then(response => response.data)
                    .then(data => {
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        [GET_ADVANCED_ANALYTICS_LOG]({}, params) {
            return new Promise((resolve, reject) => {
                api.get('/api/analytics/actions', params)
                    .then(response => response.data)
                    .then(data => {
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        [SAVE_ACTION]({}, params) {
            return new Promise((resolve, reject) => {
                api.post('/api/analytics/actions', params)
                    .then(response => response.data)
                    .then(data => {
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        [SET_DEVICE_ID]({ commit }, deviceId) {
            commit(SET_DEVICE_ID, deviceId);
        }
    }
}
