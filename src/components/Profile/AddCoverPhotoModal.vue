<template>
    <div class="mb-40 foto-cropper row-start">
        <modal
            :closeModalOnBackdropClicked="false"
            class="add-photo-modal add-cover-photo-modal"
            @close="$emit('close')"
        >
            <template v-slot:title>
                <h1 class="f-20-black f-extrabold mb-2">Add Cover Picture</h1>
            </template>
            <template v-slot:description>
                <p class="f-13-darkgrey">Your description here.</p>
            </template>
            <template v-slot:body>
                <perfect-scrollbar :class="[{'w-90': image.src && mScreen}]">
                    <div
                        class="w-100 mb-20 pr-7"
                        v-if="!image.src"
                    >
                        <label
                            class="upload-drop-area column-center pointer"
                            ref="droparea"
                            @dragenter.stop.prevent="dropActive"
                            @dragover.stop.prevent
                            @dragleave.stop.prevent="dropInActive"
                            @drop.stop.prevent="dropInActive"
                        >
                            <input
                                ref="file"
                                type="file"
                                accept="image/*"
                                @change="loadImage($event)"
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
                    <div
                        :class="[mScreen ? 'hidden': 'pr-7']"
                    >
                        <loader v-if="loadingImage"/>
                        <cropper
                            class="cropper"
                            ref="cropper"
                            :src="image.src"
                            :canvas="{
                                height: 600,
		                        width: 1620
                            }"
                            :stencil-props="{
                                aspectRatio: 27/10
                            }"
                            :stencil-size="{
                                width: 1620,
                                height: 600,
                            }"
                            :default-position="{
                                left: 0,
                                top: 70
                            }"
                            :resizeImage="false"
                            @ready="loadingImage = false"
                        />
                    </div>
                </perfect-scrollbar>
            </template>
            <template v-slot:footer>
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
                                Add cropped image
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
            </template>
        </modal>
    </div>
</template>

<script>
import { Cropper, Preview } from 'vue-advanced-cropper';
import { UploadIcon } from '@/icons';
import Modal from '@/ui/modal/Modal.vue';
import api from '@/api.js';
// import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.esm';
import { mapGetters } from 'vuex';

export default {
    name: 'CoverPhotoModal',
    components: {
        Cropper,
        Preview,
        UploadIcon,
        Modal,
        PerfectScrollbar
    },
    data() {
        return {
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
    computed: {
        ...mapGetters({
            isDarkMode: 'cards/darkModeIsActive'
        })
    },
    methods: {
        dropHandler(event) {
            let files = event.dataTransfer.files;

            if (!files.length) {
                return false;
            }

            this.loadImage(event, true);
        },
        dropActive() {
            this.$refs.droparea.style.backgroundColor = 'rgba(229, 241, 238, 0.3)';
        },
        dropInActive(event) {
            if (this.isDarkMode) {
                this.$refs.droparea.style.backgroundColor = '#081116';
            } else {
                this.$refs.droparea.style.backgroundColor = '#ffffff';
            }
        },
        cropUploadedImage() {
            if (!this.image.src) {
                this.$store.dispatch(
                    'notifications/SHOW_WARNING_NOTIFICATION',
                    'Choose image.'
                );
                return
            }

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
        loadImage(event, loadAfterDragNDrop = false) {
            this.loadingImage = true;
            const { files } = loadAfterDragNDrop ? event.dataTransfer : event.target;

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
            }
        },
        saveCroppedImage() {
            this.loading = true;

            if (!this.coordinates.width) {
                this.$store.dispatch(
                    'notifications/SHOW_ERROR_NOTIFICATION',
                    'Please crop your image!'
                );
                this.loading = false;
                return;
            }

            const { canvas } = this.$refs.cropper.getResult();

            if (canvas) {
                canvas.toBlob(blob => {
                    this.$emit('addCoverPhoto', blob, this.croppedImage.src);

                    // Second and third parameters add the setting appropriate file format here
                    // and image compress quality
                }, 'image/jpeg', 0.75);
            }
        }
    },
    mounted() {
        if (this.$refs.droparea) {
            this.$refs.droparea.addEventListener('drop', this.dropHandler, false);
        }
    },
    beforeUpdate() {
        this.$refs.droparea.removeEventListener('drop', this.dropHandler, false);
    }
}
</script>
