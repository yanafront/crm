import {
    GENERATE_XLSX_FILE,
    CREATE_TAG,
    UPDATE_TAG,
    GET_TAGS_LIST,
    BIND_TAG_TO_CARD,
    BIND_TAG_FOR_AUTHENTICATED_USER
} from '../actions/tags';
import api from '@/api.js';

export default {
    namespaced: true,
    state: {
        tagForAuthUser: null
    },
    getters: {
        tagBindedAuthUser: state => state.tagForAuthUser
    },
    mutations: {
        [BIND_TAG_FOR_AUTHENTICATED_USER](state, payload) {
            state.tagForAuthUser = payload;
        }
    },
    actions: {
        [GENERATE_XLSX_FILE]({ commit }, params) {
            return new Promise((resolve, reject) => {
                api.post(`/api/tags/generate`, params, { responseType: 'blob'})
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [CREATE_TAG]({ commit }, params) {
            return new Promise((resolve, reject) => {
                api.post(`/api/tags`, params)
                    .then(response => {
                        resolve(response.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [GET_TAGS_LIST]({ commit }, params) {
            return new Promise((resolve, reject) => {
                api.get(`/api/tags`, { params })
                    .then(response => {
                        return response.data;
                    })
                    .then(data => {
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [UPDATE_TAG]({ commit }, { tagId, params }) {
            return new Promise((resolve, reject) => {
                api.put(`/api/tags/${tagId}`, params)
                    .then(response => {
                        resolve(response.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [BIND_TAG_TO_CARD]({ commit }, params) {
            return new Promise((resolve, reject) => {
                api.post(`/api/tags/bind`, params)
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
