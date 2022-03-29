import {
    GET_PRODUCTS_AND_PLANS,
    SET_PRODUCTS_AND_PLANS,
    SUBSCRIBE_TO_PLAN,
    UNSUBSCRIBE_TO_PLAN,
    RENEW_PLAN_SUBSCIPTION
} from '../actions/stripe';
import api from '@/api.js';

export default {
    namespaced: true,
    state: {
        productsAndPlans: null
    },
    getters: {
        getAllProductsAndPlans: state => state.productsAndPlans
    },
    mutations: {
        [SET_PRODUCTS_AND_PLANS] (state, payload) {
            state.productsAndPlans = payload;
        }
    },
    actions: {
        [GET_PRODUCTS_AND_PLANS]({ commit }, params) {
            return new Promise((resolve, reject) => {
                api.get(`/api/subscriptions/products/get-primary`, params)
                    .then(response => response.data)
                    .then(data => {
                        commit(SET_PRODUCTS_AND_PLANS, data.data);
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [SUBSCRIBE_TO_PLAN]({ commit }, planId) {
            return new Promise((resolve, reject) => {
                api.post(`/api/subscriptions/plans/${planId}/subscribe`)
                    .then(response => response.data)
                    .then(data => {
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [UNSUBSCRIBE_TO_PLAN]({ commit }, planId) {
            return new Promise((resolve, reject) => {
                api.post(`/api/subscriptions/${planId}/cancel`)
                    .then(response => response.data)
                    .then(data => {
                        resolve(data.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [RENEW_PLAN_SUBSCIPTION]({ commit }, planId) {
            return new Promise((resolve, reject) => {
                api.post(`/api/subscriptions/${planId}/resume`)
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
