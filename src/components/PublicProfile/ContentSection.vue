<template>
    <div
        v-if="
            !!showContentSection
            && (publicUserRole !== USER_ROLES.INDIVIDUAL && publicUserRole !== USER_ROLES.BUSINESS)
        "
        :class="[
            'add-content-section br-20 mb-20',
            mScreen ? 'ph-8 pv-8' : 'ph-50 pv-30'
        ]"
    >
        <draggable
            v-model="contentSections"
            :disabled="!dragEnabled"
            :component-data="{ tag: 'div', name: 'flip-list', type: 'transition' }"
            item-key="name"
            class="list-group"
            v-bind="dragOptions"
            tag="transition-group"
            handle=".handle"
            @start="dragging = true"
            @end="saveContentPosition"
        >
            <template #item="{ element }">
                <div
                    :class="[
                        'list-group-item',
                        !dragEnabled ? 'not-draggable' : ' grabbable'
                    ]"
                >
                    <div
                        class="row-start"
                        v-show="element.name === SECTION_CONTENT_NAME.VIDEO
                            && uploadedVideo.length"
                    >
                        <div
                            :class="[
                                'mb-6',
                                mScreen ? 'row-between' : 'row-baseline row-start'
                            ]"
                        >
                            <h1 class="f-17-black f-extrabold">
                                <span
                                    v-if="dragEnabled"
                                    class="tarnsparent-button handle p-1"
                                >
                                    <drag-icon
                                        class="i-black"
                                        size="12"
                                    />
                                </span>
                                {{ element.name }}
                            </h1>
                        </div>
                        <div class="row-start">
                            <div
                                :class="[
                                    'lg-6 sm-12 mb-5',
                                    mScreen ? 'column-center' : 'column-start'
                                ]"
                            >
                                <iframe
                                    v-if="uploadedVideo.length"
                                    :width="iframeSize.width"
                                    :height="iframeSize.height"
                                    :src="`${uploadedVideo[0].content}`"
                                    loading="lazy"
                                    frameborder="0"
                                    allow="accelerometer;
                                    autoplay;
                                    clipboard-write;
                                    encrypted-media;
                                    gyroscope;
                                    picture-in-picture"
                                    allowfullscreen></iframe>
                                    <button
                                        v-if="uploadedVideo.length && canDeleteOrEdit"
                                        :class="[
                                            'small-border-button mt-5',
                                            { 'mr-auto' : mScreen }
                                        ]"
                                        @click="deleteContent(uploadedVideo[0], CONTENT_TYPES.VIDEO)"
                                    >
                                        Delete video
                                    </button>
                            </div>
                        </div>
                    </div>
                    <div
                        class="row-start"
                        v-show="element.name === SECTION_CONTENT_NAME.PHOTO
                            && uploadedPhoto.length"
                    >
                        <div
                            :class="[
                                'mb-6',
                                mScreen ? 'row-between' : 'row-baseline row-start'
                            ]"
                        >
                            <h1 class="f-17-black f-extrabold">
                                <span
                                    v-if="dragEnabled"
                                    class="tarnsparent-button handle p-1"
                                >
                                    <drag-icon
                                        class="i-black"
                                        size="12"
                                    />
                                </span>
                                {{ element.name }}
                            </h1>
                            <div
                                :class="[
                                    'ml-5 pointer lg-1 sm-3 z-index-2 ',
                                    {'s-align-6': mScreen}
                                ]"
                                @click.prevent="dragging = false, photoExpand = !photoExpand"
                            >
                                <span class="bg-maingreen f-12-white content-counter">
                                    {{ uploadedPhoto.length }}
                                </span>
                                <arrow-shewron
                                    class="i-green ml-3"
                                    :transform="photoExpand ? -90 : 90"
                                />
                            </div>
                        </div>
                        <div
                            class="row-start"
                            v-show="photoExpand"
                        >
                            <div
                                class="row-start flex-no-wrap lg-3 nb-6 sm-12 mb-5 content-item"
                                v-for="photo in uploadedPhoto"
                                :key="photo.id"
                            >
                                <img
                                    class="content-photo flex-shrink-1 pointer"
                                    loading="lazy"
                                    :src="photo?.media?.[0]?.thumb_url"
                                    @click="showFullImage(photo?.media?.[0]?.url, photo?.media?.[0]?.file_name)"
                                >
                                <div class="column-start s-align-2 ml-5">
                                    <span class="f-13-black f-bold row-start row-baseline">
                                        <button
                                            v-if="canDeleteOrEdit"
                                            :class="[
                                                'small-border-button',
                                                { 'mr-auto' : mScreen }
                                            ]"
                                            :style="`
                                                min-width: ${photo.id === deleteItemId && deleteLoading ? '95px' : 'auto'};
                                                height: ${photo.id === deleteItemId && deleteLoading ? '26px' : 'auto'};
                                            `"
                                            @click.stop="deleteContent(photo, CONTENT_TYPES.PHOTO)"
                                        >
                                            <loader
                                                v-if="photo.id === deleteItemId && deleteLoading"
                                                size="mini"
                                            />
                                            <template v-else>
                                                Delete photo
                                            </template>
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="row-start"
                        v-show="element.name === SECTION_CONTENT_NAME.DOCUMENTS
                            && uploadedDocs.length"
                    >
                        <div
                            :class="[
                                'mb-6',
                                mScreen ? 'row-between' : 'row-baseline row-start'
                            ]"
                        >
                            <h1 class="f-17-black f-extrabold">
                                <span
                                    v-if="dragEnabled"
                                    class="tarnsparent-button handle p-1"
                                >
                                    <drag-icon
                                        class="i-black"
                                        size="12"
                                    />
                                </span>
                                {{ element.name }}
                            </h1>
                            <div
                                :class="[
                                    'ml-5 pointer lg-1 sm-3',
                                    {'s-align-6': mScreen}
                                ]"
                                @click="dragging = false, docuentsExpand = !docuentsExpand"
                            >
                                <span class="bg-maingreen f-12-white content-counter">
                                    {{ uploadedDocs.length }}
                                </span>
                                <arrow-shewron
                                    class="i-green ml-3"
                                    :transform="docuentsExpand ? -90 : 90"
                                />
                            </div>
                        </div>
                        <div
                            class="row-between"
                            v-show="docuentsExpand"
                        >
                            <div
                                class="row-between row-baseline lg-6 sm-12 content-item"
                                v-for="(doc, index) in uploadedDocs"
                                :key="doc.id"
                            >
                                <div
                                    :class="[
                                        {'w-95': (index+1) % 2 && !mScreen},
                                        'row-baseline mb-5 bg-grey-11 ph-7 pv-5 br-7 flex-no-wrap content-item_documents'
                                    ]"
                                >
                                    <pdf-icon
                                        class="i-green flex-shrink-0"
                                        height="24"
                                        width="20"
                                    />
                                    <div class="column-start s-align-2 ml-20 ">
                                        <a :href="doc.media[0].url" target="_blank">
                                            <span>
                                                {{formatFileName(doc.media[0].file_name)}}
                                            </span>
                                        </a>
                                    </div>
                                    <button
                                        v-if="canDeleteOrEdit"
                                        class="transparent-button ml-3 delete-item-button ml-auto"
                                        @click="deleteContent(doc, CONTENT_TYPES.DOCUMENT)"
                                    >
                                        <loader
                                            v-if="doc.id === deleteItemId && deleteLoading"
                                            size="mini"
                                        />
                                        <close-icon
                                            v-else
                                            size="10"
                                            class="i-green"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </draggable>
        <modal
            :closeModalOnBackdropClicked="true"
            @close="closePhotoViewModal"
            v-if="showImage"
        >
            <template v-slot:title>
                <h1 class="f-20-black f-extrabold mb-2">
                    Photo
                </h1>
            </template>
            <template #body>
                <div class="w-100">
                    <img
                        v-if="imgVisible && imgUrl"
                        class="content-full-photo"
                        :src="imgUrl"
                    >
                    <loader v-else />
                </div>
            </template>
        </modal>
    </div>
    <loader
        v-if="loading
            && (publicUserRole !== USER_ROLES.INDIVIDUAL && publicUserRole !== USER_ROLES.BUSINESS)
            && showOnPublicProfile
        "
    />
</template>

<script>
import { ArrowShewron, PdfIcon, CloseIcon, DragIcon } from '@/icons';
import Modal from '@/ui/modal/Modal.vue';
import draggable from "vuedraggable";
import { CONTENT_TYPES, USER_ROLES } from '@/constants';
import { formatFileName } from '@/helpers/commonHelpers';
import { mapGetters } from 'vuex';

const SECTION_CONTENT_NAME = {
    VIDEO: 'Video',
    PHOTO: 'Photo',
    DOCUMENTS: 'Documents'
}

export default {
    name: 'ContentSection',
    components: {
        ArrowShewron,
        PdfIcon,
        CloseIcon,
        DragIcon,
        Modal,
        draggable
    },
    props: {
        canDeleteOrEdit: {
            type: Boolean,
            default: false
        },
        publicCardId: {
            type: [String, Number],
            required: false
        },
        showOnPublicProfile: {
            type: Boolean,
            required: false
        }
    },
    data() {
        return {
            CONTENT_TYPES,
            USER_ROLES,
            SECTION_CONTENT_NAME,
            loading: false,
            deleteLoading: false,
            deleteItemId: null,
            photoExpand: false,
            docuentsExpand: false,
            showImage: false,
            imgUrl: null,
            imgVisible: false,
            viewedFileName: '',
            contentIsLoaded: false,
            dragEnabled: true,
            dragging: false,
            contentSections: []
        }
    },
    computed: {
        ...mapGetters({
            userRole: 'user/getUserRole',
            userCardID: 'user/getCardId',
            publicCardInfo: 'cards/getPublicCard',
            photoContent: 'content/photoContentSection',
            documentContent: 'content/documentContentSection',
            videoContent: 'content/videoContentSection',
            publicUserRole: 'cards/userRoleInPublicProfile'
        }),
        uploadedPhoto() {
            if (this.photoContent?.photos.length) {
                return this.photoContent.photos;
            } else {
                return [];
            }
        },
        uploadedDocs() {
            if (this.documentContent?.documents.length) {
                return this.documentContent.documents;
            } else {
                return [];
            }
        },
        uploadedVideo() {
            if (this.videoContent?.videos.length) {
                return this.videoContent.videos;
            } else {
                return [];
            }
        },
        iframeSize() {
            if (!this.mScreen) {
                return {
                    width: 560,
                    height: 315
                }
            } else {
                return {
                    width: 300,
                    height: 190
                }
            }
        },
        showContentSection() {
            return this.photoContent?.photos.length
                || this.documentContent?.documents.length
                || this.videoContent?.videos.length;
        },
        buttonColor() {
            if (this.publicCardInfo.button_color !== 'null') {
                return this.publicCardInfo?.button_color;
            }
        },
        dragOptions() {
            return {
                animation: 0,
                group: "description",
                ghostClass: "ghost"
            };
        }
    },
    watch: {
        userCardID() {
            if (!this.contentIsLoaded) {
                this.getContent();
            }
        },
        publicCardId() {
            if (!this.contentIsLoaded) {
                this.getContent(this.publicCardId);
            }
        },
        videoContent() {
            this.setContentSections();
        },
        photoContent() {
            this.setContentSections();
        },
        documentContent() {
            this.setContentSections();
        }
    },
    methods: {
        // Methods `formatFileName` imported from helpers
        formatFileName,
        getContent(publikCardId = null) {
            this.loading = true;
            let cardId = publikCardId ? publikCardId : this.userCardID;
            this.$store.dispatch('content/GET_CONTENT', cardId)
                .then(() => {
                    this.contentIsLoaded = true;
                    this.setContentSections();
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => this.loading = false);
        },
        deleteContent(val, type) {
            this.deleteLoading = true;
            this.deleteItemId = val.id;

            let requestData = {
                params: {},
                entityId: val.id
            };

            switch (type) {
                case CONTENT_TYPES.PHOTO:
                    requestData.params['section_type'] = CONTENT_TYPES.PHOTO;
                    break;
                case CONTENT_TYPES.DOCUMENT:
                    requestData.params['section_type'] = CONTENT_TYPES.DOCUMENT;
                    break;
                case CONTENT_TYPES.VIDEO:
                    requestData.params['section_type'] = CONTENT_TYPES.VIDEO;
                    break;
            }

            this.$store.dispatch('content/DELETE_CONTENT', requestData)
                .then(() => {
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `File ${val.media[0].file_name} was deleted.`
                    );
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => {
                    this.deleteLoading = false;
                    this.deleteItemId = null;
                });
        },
        showFullImage(imageUrl, fileName) {
            if (imageUrl) {
                this.showImage = true;
                this.imgUrl = imageUrl;

                const image = document.createElement('img');
                image.src = imageUrl;
                image.onload = () => this.imgVisible = true;
            }

            if (fileName) {
                this.viewedFileName = fileName;
            }
        },
        closePhotoViewModal() {
            this.showImage = false;
            this.imgUrl = null;
            this.imgVisible = false;
        },
        setContentSections() {
            let contents = [];

            if (this.videoContent?.videos.length) {
                contents.push(this.videoContent);
            }

            if (this.photoContent?.photos.length) {
                contents.push(this.photoContent);
            }

            if (this.documentContent?.documents.length) {
                contents.push(this.documentContent);
            }

            this.contentSections = contents.sort((a, b) => a.position - b.position);
        },
        saveContentPosition() {
            this.dragging = false;
            if (this.contentSections.length > 1) {
                let reorderedSection = [];
                this.contentSections.forEach((el, index) => {
                    el.position = index;
                    reorderedSection.push({
                        id: el.id,
                        position: el.position
                    })
                });

                let params = {
                    sections: reorderedSection
                };

                this.$store.dispatch('content/REORDER_CONTENT_SECTION', params)
                    .then(() => {
                        this.$store.dispatch(
                            'notifications/SHOW_SUCCESS_NOTIFICATION',
                            `Sections have been reordered.`
                        );
                    })
                    .catch(error => {
                        this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                    });
            }
        }
    },
    created() {
        if (this.$route.name === 'PublicProfile') {
            this.dragEnabled = false;
        }

        if (this.userCardID && !this.showOnPublicProfile) {
            this.getContent();
        }

        if (this.publicCardId) {
            this.getContent(this.publicCardId);
        }
    }
}
</script>
