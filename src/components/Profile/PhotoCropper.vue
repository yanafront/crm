<template>
    <div class="mb-40 foto-cropper row-start">
        <div
            :class="[
                'cropper-preview',
                mScreen ? 'mh-auto' : 'mr-30'
            ]"
        >
            <div
                v-if="cardImage && !croppedImage.src"
                class="profile-card_image mr-20"
                :style="`
                    background: url(${cardImage}) no-repeat 0% 0%;
                    background-size: cover;
                `"
            ></div>
            <div
                v-else-if="!cardImage && !croppedImage.src"
                class="cropper-preview-stub"
            ></div>
            <preview
                v-else
                :width="80"
                :height="80"
                :image="image"
                :coordinates="coordinates"
            />
        </div>
        <div class="s-align-5 sm-12 mt-sm-1">
            <primary-button
                class="image-upload-btn"
                @click="selectFile"
            >
                <input
                    ref="file"
                    type="file"
                    accept="image/*"
                    @change="loadImage($event)"
                />
                Upload new picture
            </primary-button>
            <button
                v-if="cardId"
                type="button"
                :class="[
                    'transparent-button f-14-grey f-sbold',
                    mScreen ? 'ml-20' : 'ml-30'
                ]"
                @click="deleteImage"
            >
                Delete picture
            </button>
        </div>
        <modal
            v-if="showModal"
            :closeModalOnBackdropClicked="false"
            @close="closeAvatarModal"
        >
            <template v-slot:title>
                <h1 class="f-20-black f-extrabold mb-2">Profile photo</h1>
            </template>
            <template v-slot:description>
                <p class="f-13-darkgrey">Set profile photo</p>
            </template>
            <template v-slot:body>
                <div>
                    <loader v-if="loadingImage"/>
                    <cropper
                        class="cropper"
                        ref="cropper"
                        :src="image.src"
                        :canvas="{
                            minHeight: 0,
                            minWidth: 0,
                            maxHeight: 600,
                            maxWidth: 500,
                        }"
                        :stencil-props="{
                            aspectRatio: 1
                        }"
                        @ready="loadingImage = false"
                    />
                    <div class="row-end mt-8">
                        <primary-button
                            class="mr-3"
                            @click="cropUploadedImage()"
                        >
                            Crop image
                        </primary-button>
                        <primary-button
                            @click="saveCroppedImage"
                        >
                            <template v-if="!loading">
                                Save cropped image
                            </template>
                            <template v-else>
                                <loader
                                    size="mini"
                                    loaderColor="white"
                                    class="s-align-5"
                                />
                            </template>
                        </primary-button>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
            </template>
        </modal>
    </div>
</template>

<script>
import { Cropper, Preview } from 'vue-advanced-cropper';
import Modal from '@/ui/modal/Modal.vue';

export default {
    name: 'PhotoCropper',
    components: {
        Cropper,
        Preview,
        Modal
    },
    props: {
        cardId: {
            type: [String, Number],
            required: false
        },
        cardImage: {
            type: [String],
            required: false
        }
    },
    emits: ['croppedAvatar'],
    data() {
        return {
            showModal: false,
            loading: false,
            loadingImage: false,
            imageFile: null,
            image: {
                src: null,
                type: null
            },
            coordinates: {
                width: 0,
                height: 0,
                left: 0,
                top: 0,
            },
            croppedImage: {
                src: ''
            }
        }
    },
    methods: {
        cropUploadedImage() {
            this.$store.dispatch(
                'notifications/SHOW_SUCCESS_NOTIFICATION',
                'The image has been cropped!'
            );

            const { coordinates, canvas, } = this.$refs.cropper.getResult();
            this.coordinates = coordinates;
            // You able to do different manipulations at a canvas
            // but there we just get a cropped image, that can be used
            // as src for <img/> to preview result
            this.croppedImage.src = canvas.toDataURL();
        },
        selectFile() {
            this.$refs.file.click();

            if (this.imageFile) {
                this.showModal = true;
            }

            this.loadingImage = true;
        },
        loadImage(event) {
            // Reference to the DOM input element
            const { files } = event.target;
            // Ensure that you have a file before attempting to read it
            if (files && files[0]) {
                this.imageFile = files[0];
                // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
                if (this.image.src) {
                    URL.revokeObjectURL(this.image.src);
                }
                // 2. Create the blob link to the file to optimize performance:
                const blob = URL.createObjectURL(files[0]);
                // Create a new FileReader to read this image binary data
                const reader = new FileReader();
                // Define a callback function to run, when FileReader finishes its job
                reader.onload = (e) => {
                    // Note: arrow function used here, so that "this.image" refers to the image of Vue component
                    this.image = {
                        // Read image as base64 and set it as src:
                        src: blob,
                        // Determine the image type to preserve it during the extracting the image from canvas:
                        // type: getMimeType(e.target.result, files[0].type),
                    };
                };
                // Start the reader job - read file as a data url (base64 format)
                reader.readAsArrayBuffer(files[0]);

                this.showModal = true;
            }
        },
        closeAvatarModal() {
            this.showModal = false;
        },
        saveCroppedImage() {
            this.loading = true;
            let vm = this;

            if (!this.coordinates.width) {
                this.$store.dispatch(
                    'notifications/SHOW_ERROR_NOTIFICATION',
                    'Please crop your image!'
                );
                this.loading = false;
                return;
            }

            const { canvas } = this.$refs.cropper.getResult();

            if (canvas && this.cardId) {
                let params = new FormData();

                canvas.toBlob(blob => {
                    params.append('_method','PUT');
                    params.append('image', blob);

                    let requestData = {
                        params: params,
                        cardId: this.cardId
                    };

                    this.$store.dispatch('cards/UPDATE_CARD_WITH_FORMDATA', requestData)
                        .then(() => {
                            vm.showModal = false;
                            vm.$store.dispatch(
                                'notifications/SHOW_SUCCESS_NOTIFICATION',
                                'Your image has been saved successfully!'
                            );
                        })
                        .catch(error => {
                            vm.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                        })
                        .finally(() => vm.loading = false);
                    // Second and third parameters add the setting appropriate file format here
                    // and image compress quality
                }, 'image/jpeg', 0.6);
            } else {
                canvas.toBlob(blob => {
                    this.$emit('croppedAvatar', blob);
                    vm.showModal = false;
                    vm.loading = false;
                }, 'image/jpeg', 0.6);
            }
        },
        deleteImage() {
            let params = new FormData();
            params.append('_method','PUT');
            params.append('image', '');

            let requestData = {
                params: params,
                cardId: this.cardId
            };

            this.$store.dispatch('cards/UPDATE_CARD_WITH_FORMDATA', requestData)
                .then(() => {
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Your image has been deleted!`
                    );
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                })
                .finally(() => {
                    this.image = {
                        src: null,
                        type: null
                    };

                    this.croppedImage = {
                        src: ''
                    };
                });
        }
    }
}
</script>
