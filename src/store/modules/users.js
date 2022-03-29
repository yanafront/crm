import {
    GET_ALL_USERS_BY_SUPERADMIN,
    GET_ALL_BUSINESS,
    GET_ALL_BUSINESS_SUBUSERS,
    CREATE_USER_BY_SUPERADMIN,
    CREATE_BUSINESS_BY_SUPERADMIN,
    WIPE_OUT_CARD,
    SET_SELECTED_USER,
    TOGGLE_USER_IS_PRO,
    DEACTIVATE_USER,
    CONVERT_USER_TO_BUSINESS,
    CONVERT_BUSINESS_TO_USER,
    REMOVE_USER_FROM_BUSINESS,
    BIND_USER_TO_EXISTING_BUSINESS
} from '../actions/users';
import api from '@/api.js';

export default {
    namespaced: true,
    state: {
        selectedUsers: []
    },
    getters: {
        usersIsSelected: state => !!state.selectedUsers.length,
        getAllSelectedUsers: state => state.selectedUsers
    },
    mutations: {
        [SET_SELECTED_USER] (state, payload) {
            state.selectedUsers = payload;
        }
    },
    actions: {
        [GET_ALL_USERS_BY_SUPERADMIN]({ commit }, { params }) {
            return new Promise((resolve, reject) => {
                api.get(`/api/users`, { params })
                    .then(response => response.data)
                    .then(data => {
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [GET_ALL_BUSINESS]({ commit }) {
            let params = {
                perPage: 10000
            };

            return new Promise((resolve, reject) => {
                api.get(`/api/business-users`, { params })
                    .then(response => response.data)
                    .then(data => {
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [GET_ALL_BUSINESS_SUBUSERS]({ commit }, { userId, params }) {
            return new Promise((resolve, reject) => {
                api.get(`/api/business-users/${userId}/sub-users`, { params })
                    .then(response => response.data)
                    .then(data => {
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [CREATE_USER_BY_SUPERADMIN]({ commit }, params) {
            return new Promise((resolve, reject) => {
                api.post(`/api/users`,  params)
                    .then(response => response.data)
                    .then(data => {
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [CREATE_BUSINESS_BY_SUPERADMIN]({ state, commit }, params) {
            if (state.selectedUsers.length) {
                params['sub_users'] = state.selectedUsers;
            }

            return new Promise((resolve, reject) => {
                api.post(`/api/business-users`,  params)
                    .then(response => response.data)
                    .then(data => {
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [WIPE_OUT_CARD]({ commit }, { cardId, params }) {
            return new Promise((resolve, reject) => {
                api.post(`/api/cards/${cardId}/wipe-out`,  params)
                    .then(response => response.data)
                    .then(data => {
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [TOGGLE_USER_IS_PRO]({ commit }, { userId, isPro }) {
            return new Promise((resolve, reject) => {
                api.post(`/api/users/${userId}/switch-pro`, {is_pro: isPro})
                    .then(response => response.data)
                    .then(data => {
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [DEACTIVATE_USER]({ commit }, userId) {
            return new Promise((resolve, reject) => {
                api.post(`/api/users/${userId}/deactivate`)
                    .then(response => response.data)
                    .then(data => {
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [CONVERT_USER_TO_BUSINESS]({ commit }, { userId }) {
            return new Promise((resolve, reject) => {
                api.post(`/api/users/${userId}/convert-to-business`)
                    .then(response => response.data)
                    .then(data => {
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [CONVERT_BUSINESS_TO_USER]({ commit }, { userId }) {
            return new Promise((resolve, reject) => {
                api.post(`/api/users/${userId}/convert-to-individual`)
                    .then(response => response.data)
                    .then(data => {
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [REMOVE_USER_FROM_BUSINESS]({ commit }, { userId }) {
            return new Promise((resolve, reject) => {
                api.post(`/api/users/${userId}/remove-from-business`)
                    .then(response => response.data)
                    .then(data => {
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [BIND_USER_TO_EXISTING_BUSINESS]({ state, commit }, params) {
            if (state.selectedUsers.length) {
                params['users'] = state.selectedUsers;
            }

            return new Promise((resolve, reject) => {
                api.post(`/api/users/add-to-business`, params)
                    .then(response => response.data)
                    .then(data => {
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        }
    }
}
