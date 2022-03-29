<template>
    <modal
        :closeModalOnBackdropClicked="true"
        @close="$emit('close')"
        class="add-video-modal"
    >
        <template v-slot:title>
            <h1 class="f-20-black f-extrabold mb-2">Add Video</h1>
        </template>
        <template v-slot:description>
            <p class="f-13-darkgrey">Copy and paste video link from Youtube or Vimeo.</p>
        </template>
        <template #body>
            <div class="column-center">
                <Form
                    class="w-100 column-start"
                    :validation-schema="schema"
                    @submit="saveVideoLink"
                    @invalid-submit="onInvalidSubmit"
                    v-slot="{ errors }"
                >
                    <div class="row-start">
                        <form-input
                            id="url"
                            class="w-100"
                            label="Video link URL"
                            name="url"
                            placeholder="Embed video link"
                            v-model="originalLink"
                            :errors="errors"
                        />
                    </div>
                    <div class="row-start mv-5">
                        <div class="lg-6 pr-1">
                            <button
                                class="primary-button w-100"
                                type="button"
                                @click="parseUrl"
                            >
                                Video preview
                            </button>
                        </div>
                        <div class="lg-6 pl-1">
                            <button
                                class="primary-button w-100"
                                type="submit"
                            >
                                Save video
                            </button>
                        </div>
                    </div>
                </Form>
                <iframe
                    v-if="linkAdded"
                    :width="iframeSize.width"
                    :height="iframeSize.height"
                    :src="`${embedLink}`"
                    loading="lazy"
                    frameborder="0"
                    allow="accelerometer;
                    autoplay;
                    clipboard-write;
                    encrypted-media;
                    gyroscope;
                    picture-in-picture"
                    allowfullscreen></iframe>
            </div>
        </template>
    </modal>
</template>

<script>
import Modal from '@/ui/modal/Modal.vue';
import { Form } from 'vee-validate';
import { CONTENT_TYPES } from '@/constants';
import * as yup from 'yup';
import { mapGetters } from 'vuex';

const YOUTUBE_REGEXP = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be|youtube))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/i;

export default {
    name: 'AddVideoModal',
    components: {
        Modal,
        Form
    },
    data() {
        const schema = yup.object({
            url: yup.string()
                .matches(
                    YOUTUBE_REGEXP,
                    'Video link URL must be a valid URL!'
                )
                .required('Video link URL is a required field'),
        });

        return {
            schema,
            originalLink: '',
            embedLink: '',
            linkAdded: false,
            videos: [
                {
                    reg: YOUTUBE_REGEXP,
                    url: 'https://www.youtube.com/embed/$5',
                    params: {
                        'picture-in-picture': 1,
                        accelerometer: 1,
                        gyroscope: 1
                    }
                },
                {
                    reg: /^.*vimeo.com\/(\d+)($|\/|\b)/i,
                    url: 'https://player.vimeo.com/video/$1',
                    params: {
                        title: 0,
                        byline: 0,
                        portrait: 0
                    },
                }
            ],
            videoFormData: new FormData()
        }
    },
    computed: {
        ...mapGetters({
            userCardID: 'user/getCardId',
            videoContent: 'content/videoContentSection'
        }),
        iframeSize() {
            if (!this.mScreen) {
                return {
                    width: 450,
                    height: 230
                }
            } else {
                return {
                    width: 360,
                    height: 170
                }
            }
        }
    },
    methods: {
        initFormData() {
            this.videoFormData.append('section_name', 'Video');
            this.videoFormData.append('section_type', CONTENT_TYPES.VIDEO);

            if (this.videoContent?.id) {
                this.videoFormData.append('section_id', this.videoContent.id);
            }
        },
        onInvalidSubmit({ values, errors, results }) {
            /* values -> current form values
             * errors -> a map of field names and their first error message
             * results ->  a detailed map of field names and their validation results
             */
            this.$store.dispatch('notifications/SHOW_VALIDATION_ERROR_NOTIFICATION', errors);
        },
        parseUrl() {
            if (!this.originalLink) {
                this.$store.dispatch(
                    'notifications/SHOW_ERROR_NOTIFICATION',
                    `Copy and paste the link from your browser.`
                );
            }

            if (this.originalLink) {
                for (let i = 0; i < this.videos.length; i++) {
                    const v = this.videos[i];
                    var m = v.reg.exec(this.originalLink);

                    if (m) {
                        var params = Object.assign({}, v.params);
                        var query = Object.keys(params).map(key => key + '=' + params[key]).join('&');
                        var and = v.url.indexOf('?') >= 0 ? '&' : '?';
                        this.embedLink = this.originalLink.replace(v.reg, v.url) + and + query;
                        this.linkAdded = true;
                        this.videoFormData.append('videos[0][content]', this.embedLink);

                        if (this.originalLink.includes('youtube')
                            || this.originalLink.includes('youtu')
                        ) {
                            this.videoFormData.append('videos[0][type]', 'youtube');
                        }

                        if (this.originalLink.includes('vimeo')) {
                            this.videoFormData.append('videos[0][type]', 'vimeo');
                        }
                        return;
                    }
                }
            }
        },
        saveVideoLink() {
            if (!this.linkAdded) {
                this.parseUrl();
            }

            let requestPayload = {
                cardId: this.userCardID,
                params: this.videoFormData
            }

            this.$store.dispatch('content/ADD_CONTENT_TO_CARD', requestPayload)
                .then(data => {
                    this.$store.dispatch(
                        'notifications/SHOW_SUCCESS_NOTIFICATION',
                        `Video has been uploaded.`
                    );
                    this.$emit('close');
                })
                .catch(error => {
                    this.$store.dispatch('notifications/SHOW_REQUEST_ERROR_NOTIFICATION', error);
                });
        }
    },
    created() {
        this.initFormData();
    }
}
</script>
