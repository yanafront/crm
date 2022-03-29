<template>
    <modal
        :closeModalOnBackdropClicked="false"
        @close="$emit('close')"
        class="add-photo-modal"
    >
        <template v-slot:title>
            <h1
                v-if="isPhotoUploadModal"
                class="f-20-black f-extrabold mb-2"
            >
                Add Photo
            </h1>
            <h1
                v-else
                class="f-20-black f-extrabold mb-2"
            >
                Add PDF Documents
            </h1>
        </template>
        <template v-slot:description>
            <p
                class="f-13-darkgrey"
                v-if="isPhotoUploadModal"
            >
                You can upload up to 10 photos.
            </p>
            <p
                class="f-13-darkgrey"
                v-else
            >
                You can upload up to 10 PDF files.
            </p>
        </template>
        <template #body>
            <div class="w-100">
                <label
                    class="upload-drop-area column-center pointer"
                    ref="droparea"
                    @dragenter.stop.prevent="dropActive"
                    @dragover.stop.prevent
                    @dragleave.stop.prevent="dropInActive"
                    @drop.stop.prevent="dropInActive"
                >
                    <input
                        type="file"
                        name="file_upload"
                        ref="uploadInput"
                        multiple="multiple"
                        @change="fileInputHandler"
                    />
                    <div class="column-center">
                        <span class="round-iconX43 main-green-lighter">
                            <upload-icon class="i-green"/>
                        </span>
                        <span class="f-12-black f-sbold mt-8">
                            Click to upload or drag and drop
                        </span>
                    </div>
                </label>
            </div>
        </template>
        <template #footer>
            <div class="mt-20">
                <content-upload-preview
                    v-for="(file, index) in toUploadFiles"
                    :file="file"
                    :key="index"
                    :filesInProgress="filesInProgress"
                />
            </div>
            <div class="row-end mt-7">
                <button
                    :class="[!toStartUpload && !filesInProgressLength ? 'border-button' : 'primary-button']"
                    :disabled="!toStartUpload && !filesInProgressLength"
                    @click="doneFileUploading"
                >
                    <template v-if="filesInProgressLength">
                        <loader
                            size="mini"
                            loaderColor="white"
                            class="s-align-5"
                        />
                    </template>
                    <template v-else>
                        Done
                    </template>
                </button>
            </div>
        </template>
    </modal>
</template>

<script>
import Modal from '@/ui/modal/Modal.vue';
import ContentUploadPreview from './ContentUploadPreview.vue';
import { UploadIcon } from '@/icons';
import { IMAGE_TYPE, PDF_TYPE, CONTENT_TYPES, MEGABYTE_SIZE } from '@/constants';
import { mapGetters } from 'vuex';

const MAX_LIMIT_UPLOAD_IMAGE = 10;

export default {
        name: 'UploadFileModal',
        components: {
            Modal,
            UploadIcon,
            ContentUploadPreview
        },
        props: {
            uploadedType: {
               type: String,
               default: 'photo'
            }
        },
        data() {
            return {
                toStartUpload: false,
                toUploadFiles: [],
                filesInProgress: [],
                photoFormData: new FormData()
            }
        },
        computed: {
            ...mapGetters({
                userCardID: 'user/getCardId',
                photoContent: 'content/photoContentSection',
                documentContent: 'content/documentContentSection',
                isDarkMode: 'cards/darkModeIsActive'
            }),
            isPhotoUploadModal() {
                return this.uploadedType === CONTENT_TYPES.PHOTO;
            },
            uploadFilesLength() {
                return this.toUploadFiles.length;
            },
            filesInProgressLength() {
                return !!this.filesInProgress.length;
            },
            fileUploadedCounter() {
                if (this.isPhotoUploadModal) {
                    if (this.photoContent?.photos.length) {
                        return this.photoContent.photos.length;
                    } else {
                        return 0;
                    }
                } else {
                    if (this.documentContent?.documents.length) {
                        return this.documentContent.documents.length;
                    } else {
                        return 0;
                    }
                }
            },
            earlierUploadedPhoto() {
                if (this.photoContent?.photos.length) {
                    return this.photoContent.photos.map(photo => photo.id);
                } else {
                    return null;
                }
            },
            earlierUploadedDocs() {
                if (this.documentContent?.documents.length) {
                    return this.documentContent.documents.map(doc => doc.id);
                } else {
                    return null;
                }
            }
        },
        methods: {
            initFormData() {
                if (this.isPhotoUploadModal) {
                    this.photoFormData.append('section_name', 'Photo');
                    this.photoFormData.append('section_type', CONTENT_TYPES.PHOTO);

                    if (this.photoContent?.id) {
                        this.photoFormData.append('section_id', this.photoContent.id);
                    }

                    if (this.earlierUploadedPhoto && this.earlierUploadedPhoto.length) {
                        this.earlierUploadedPhoto.forEach((item, index) => {
                            this.photoFormData.append(`photos[${index}][id]`, item);
                        });
                    }
                } else {
                    this.photoFormData.append('section_name', 'Documents');
                    this.photoFormData.append('section_type', CONTENT_TYPES.DOCUMENT);

                    if (this.documentContent?.id) {
                        this.photoFormData.append('section_id', this.documentContent.id);
                    }

                    if (this.earlierUploadedDocs && this.earlierUploadedDocs.length) {
                        this.earlierUploadedDocs.forEach((item, index) => {
                            this.photoFormData.append(`documents[${index}][id]`, item);
                        });
                    }
                }
            },
            dropActive() {
                this.$refs.droparea.style.backgroundColor = 'rgba(229, 241, 238, 0.3)';
            },
            dropInActive() {
                if (this.isDarkMode) {
                    this.$refs.droparea.style.backgroundColor = '#081116';
                } else {
                    this.$refs.droparea.style.backgroundColor = '#ffffff';
                }
            },
            prepeareFilesForUploading(files) {
                let allFilesSize = 0;
                [...files].forEach(f => {
                    allFilesSize += f.size;
                });

                if (allFilesSize > (MEGABYTE_SIZE * 25)) {
                    this.$store.dispatch(
                        'notifications/SHOW_ERROR_NOTIFICATION',
                        `All uploaded files should be less than 25Mb! \n You want to upload ${(allFilesSize/MEGABYTE_SIZE).toFixed()} Mb.`
                    );
                    return;
                }

                // Selected files for upload must be dynamic number (choosen file + uploaded files earlier).
                if (files.length > (MAX_LIMIT_UPLOAD_IMAGE - this.fileUploadedCounter)) {
                    this.$store.dispatch(
                        'notifications/SHOW_ERROR_NOTIFICATION',
                        'The maximum number of files is 10!'
                    );
                    return;
                }

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];

                    if (this.isPhotoUploadModal) {
                        if (!file.type.match(IMAGE_TYPE)) {
                            this.$store.dispatch(
                                'notifications/SHOW_ERROR_NOTIFICATION',
                                'You can only upload images!'
                            );
                            return;
                        }
                    } else {
                        if (!file.type.match(PDF_TYPE)) {
                            this.$store.dispatch(
                                'notifications/SHOW_ERROR_NOTIFICATION',
                                'You can only upload PDF!'
                            );
                            return;
                        }
                    }

                    this.filesInProgress.push(file.name);
                    this.toUploadFiles.push(file);

                    let filesIndexCounter
                    if (this.isPhotoUploadModal) {
                        if (this.earlierUploadedPhoto && this.earlierUploadedPhoto.length) {
                            filesIndexCounter = this.earlierUploadedPhoto.length + i;
                        } else {
                            filesIndexCounter = i;
                        }

                        this.photoFormData.append(`photos[${filesIndexCounter}][file]`, file);
                    } else {
                        if (this.earlierUploadedDocs && this.earlierUploadedDocs.length) {
                            filesIndexCounter = this.earlierUploadedDocs.length + i;
                        } else {
                            filesIndexCounter = i;
                        }

                        this.photoFormData.append(`documents[${filesIndexCounter}][file]`, file);
                        this.photoFormData.append(`documents[${filesIndexCounter}][type]`, 'pdf');
                    }
                }

                this.uploadFiles();
            },
            fileInputHandler(event) {
                if (!this.$refs.uploadInput.files.length) {
                    return false;
                }

                this.prepeareFilesForUploading(this.$refs.uploadInput.files);
            },
            dropHandler(event) {
                let files = event.dataTransfer.files;

                if (!files.length) {
                    return false;
                }

                this.prepeareFilesForUploading(files);
            },
            uploadFiles() {
                this.toStartUpload = true;

                let requestPayload = {
                    cardId: this.userCardID,
                    params: this.photoFormData
                }

                this.$store.dispatch('content/ADD_CONTENT_TO_CARD', requestPayload)
                    .then(data => {
                        if (this.filesInProgress.length) {
                            for (let i = 0; i < this.filesInProgress.length; i++) {
                                if (this.filesInProgress[i] === this.filesInProgress[0]) {
                                    this.filesInProgress.splice(i, 1);
                                    i--;
                                }
                            }
                        }

                        this.$store.dispatch(
                            'notifications/SHOW_SUCCESS_NOTIFICATION',
                            `Files were uploaded.`
                        );
                    })
                    .catch(error => {
                        this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                    });
            },
            doneFileUploading() {
                if (this.toStartUpload && !this.filesInProgressLength) {
                    this.$emit('close');
                }
            }
        },
        created() {
            this.initFormData();
        },
        mounted() {
            if (this.$refs.droparea) {
                this.$refs.droparea.addEventListener('drop', this.dropHandler, false);
            }
        },
        beforeUnmount() {
            this.$refs.droparea.removeEventListener('drop', this.dropHandler, false);
        }
    }
</script>
