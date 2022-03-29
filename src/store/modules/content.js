import {
    ADD_CONTENT_TO_CARD,
    SET_CONTENT,
    GET_CONTENT,
    UPDATE_CONTENT,
    DELETE_CONTENT,
    REMOVE_DELETED_CONTENT,
    REORDER_CONTENT_SECTION
} from '../actions/content';
import api from '@/api.js';
import { CONTENT_TYPES } from '@/constants';

export default {
    namespaced: true,
    state: {
        content: []
    },
    getters: {
        getAllContent: state => state.content,
        contentIsEmpty: state => state.content.length,
        photoContentSection: state => {
            return state.content.find(section => section.type === CONTENT_TYPES.PHOTO);
        },
        documentContentSection: state => {
            return state.content.find(section => section.type === CONTENT_TYPES.DOCUMENT);
        },
        videoContentSection: state => {
            return state.content.find(section => section.type === CONTENT_TYPES.VIDEO);
        },
        linksContentSection: state => {
            return state.content.find(section => section.type === CONTENT_TYPES.LINK);
        }
    },
    mutations: {
        [SET_CONTENT] (state, payload) {
            state.content = payload;
        },
        [UPDATE_CONTENT] (state, payload) {
            const contentType = payload.type;
            const sectionId = payload.id;

            const sectionForUpdate = state.content.findIndex(section => {
                return section.type === contentType && section.id === sectionId;
            });

            if (sectionForUpdate !== -1) {
                switch (contentType) {
                    case CONTENT_TYPES.PHOTO:
                        state.content[sectionForUpdate].photos = payload.photos;
                        break;
                    case CONTENT_TYPES.DOCUMENT:
                        state.content[sectionForUpdate].documents = payload.documents;
                        break;
                    case CONTENT_TYPES.VIDEO:
                        state.content[sectionForUpdate].videos = payload.videos;
                        break;
                    case CONTENT_TYPES.LINK:
                        state.content[sectionForUpdate].links = payload.links;
                        break;
                }
            } else {
                state.content.push(payload);
            }
        },
        [REMOVE_DELETED_CONTENT] (state, payload) {
            const contentType = payload.params.section_type;
            const entityId = payload.entityId;

            const sectionForUpdate = state.content.findIndex(section => {
                return section.type === contentType;
            });

            if (sectionForUpdate !== -1) {
                switch (contentType) {
                    case CONTENT_TYPES.PHOTO:
                        const photoId = state.content[sectionForUpdate].photos.findIndex(el => el.id === entityId);
                        if (photoId !== -1) {
                            state.content[sectionForUpdate].photos.splice(photoId, 1);
                        };
                        break;
                    case CONTENT_TYPES.DOCUMENT:
                        const docId = state.content[sectionForUpdate].documents.findIndex(el => el.id === entityId);
                        if (docId !== -1) {
                            state.content[sectionForUpdate].documents.splice(docId, 1);
                        };
                        break;
                    case CONTENT_TYPES.VIDEO:
                        const videoId = state.content[sectionForUpdate].videos.findIndex(el => el.id === entityId);
                        if (videoId !== -1) {
                            state.content[sectionForUpdate].videos.splice(videoId, 1);
                        };
                        break;
                }
            }
        }
    },
    actions: {
        [ADD_CONTENT_TO_CARD]({ commit }, { cardId, params }) {
            return new Promise((resolve, reject) => {
                api.post(`/api/cards/${cardId}/contents`, params, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(response => response.data)
                    .then(data => {
                        commit(UPDATE_CONTENT, data.data);
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [GET_CONTENT]({ commit }, cardId) {
            return new Promise((resolve, reject) => {
                api.get(`/api/cards/${cardId}/contents`)
                    .then(response => response.data)
                    .then(data => {
                        commit(SET_CONTENT, data.data);
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [DELETE_CONTENT]({ commit },  { entityId, params }) {
            return new Promise((resolve, reject) => {
                api.delete(`/api/cards/contents/${entityId}`, { params })
                    .then(response => response.data)
                    .then(data => {
                        const mutationData = {
                            entityId,
                            params
                        }
                        commit(REMOVE_DELETED_CONTENT, mutationData);
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        [REORDER_CONTENT_SECTION]({ commit }, params) {
            return new Promise((resolve, reject) => {
                api.post(`/api/cards/sections/reorder`, params)
                    .then(response => response.data)
                    .then(data => {
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
    }
}
