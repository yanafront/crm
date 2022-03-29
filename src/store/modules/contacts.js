import {
    SAVE_CONTACT,
    GET_ALL_CONTACTS,
    DELETE_CONTACT
} from '../actions/contacts';
import api from '@/api.js';

export default {
    namespaced: true,
    state: {
    },
    getters: {

    },
    mutations: {

    },
    actions: {
        [SAVE_CONTACT]({}, params) {
            return new Promise((resolve, reject) => {
                api.post('/api/contacts', params)
                    .then(response => response.data)
                    .then(data => {
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [GET_ALL_CONTACTS]({ commit }, params) {
            return new Promise((resolve, reject) => {
                api.get('/api/contacts', { params })
                    .then(response => response.data)
                    .then(data => {
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [DELETE_CONTACT]({ commit }, contactId) {
            return new Promise((resolve, reject) => {
                api.delete(`/api/contacts/${contactId}`,)
                    .then(response => response.data)
                    .then(data => {
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        }
    }
}
