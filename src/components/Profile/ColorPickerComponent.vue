<template>
    <div class="color-picer-modal">
        <div class="column-start">
            <div class="mh-auto relative">
                <span
                    class="close-modal pointer"
                    @click="$emit('close')"
                >
                    <close-icon
                        class="i-white"
                        size="10"
                    />
                </span>
                <color-picker
                    theme="dark"
                    :color="color"
                    :colors-default="defaultColors"
                    @changeColor="changeColor"
                />
            </div>
            <div class="row-center mt-3">
                <primary-button
                    class="mr-5"
                    @click="saveChoosenColor"
                >
                    Save
                </primary-button>
            </div>
        </div>
    </div>
</template>

<script>
import { ColorPicker } from 'vue-color-kit';
import { CloseIcon} from '@/icons';

export default {
    name: 'ColorPickerComponent',
    components: {
        ColorPicker,
        CloseIcon
    },
    props: {
        colorForChange: {
            type: String,
            default: '#000000'
        }
    },
    emits: ['closeColorPicker'],
    data() {
        return {
            defaultColors: [],
            color: ''
        }
    },
    methods: {
        changeColor(color) {
            this.color = `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${color.rgba.a})`;
        },
        saveChoosenColor() {
            this.$emit('closeColorPicker', this.color);
        }
    },
    created() {
        this.color = this.colorForChange;
    }
}
</script>
