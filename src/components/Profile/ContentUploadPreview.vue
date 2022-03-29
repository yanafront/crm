<template>
    <div
        :class="[
            'uploading-file mb-2',
            place == 'modal' ? 'row-between' : 'row-start'
        ]"
        v-if="preview != null"
    >
        <div :class="['s-align-4', place == 'modal' ? 'w-85' : 'w-100']">
            <span
                v-if="preview.type == 'img'"
                :class="['uploading-img mr-2', { 'uploading-img-blur': loading }]"
                :style="{ backgroundImage: `url(${preview.img})` }"
            />
            <span class="uploading-file-description column-start">
                <span class="f-12-black f-sbold">
                    {{ formatFileName(preview.name) }}
                </span>
                <span class="f-12-grey" v-if="preview.size.length">{{ preview.size }} MB</span>
            </span>
        </div>
        <div
            class="s-align-4"
            v-if="place == 'modal'"
        >
            <loader
                size="mini"
                v-if="loading"
            />
            <mark-icon
                v-else
                class="i-green"
                size="16"
            />
        </div>
    </div>
</template>

<script>
import { MarkIcon } from '@/icons';
import { MEGABYTE_SIZE, ZIP_TYPE, IMAGE_TYPE, VIDEO_TYPE } from '@/constants';
import { formatFileName } from '@/helpers/commonHelpers';

export default {
    name: 'ContentUploadPreview',
    props: {
        file: {
            validator: function (value) {
                return typeof value === 'object';
            }
        },
        place: {
            type: String,
            default: 'modal'
        },
        filesInProgress: {
            type: Array,
            default: () => []
        }
    },
    components: {
        MarkIcon
    },
    data() {
        return {
            preview: null
        }
    },
    computed: {
        loading() {
            return !!this.filesInProgress.find(i => i == this.file.name);
        }
    },
    methods: {
        getPreview(file) {
            let preview = {
                name: file.name,
                type: '',
                size: file.size == undefined ? '' : parseFloat(file.size/MEGABYTE_SIZE).toFixed(2),
                img: ''
            };

            if (file.type == ZIP_TYPE) {
                preview.type = 'zip';
            } else if (file.type.match(IMAGE_TYPE)) {
                preview.type = 'img';

                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function() {
                    preview.img = reader.result;
                };
            } else if (file.type.match(VIDEO_TYPE)) {
                preview.type = 'video';
            } else {
                preview.type = 'document';
            };

            this.preview = preview;
        },
        // Methods `formatFileName` imported from helpers
        formatFileName
    },
    mounted() {
        if (this.file) {
            this.getPreview(this.file);
        }
    }
}
</script>
