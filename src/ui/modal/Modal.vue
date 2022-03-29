<template>
    <div
        class="modal"
        @click="closeModaleventEmitter"
    >
        <div
            class="modal-content-box"
            @click.stop
        >
            <div class="modal-header column-start mb-30">
                <div
                    :class="[
                        showCloseButton ? 'row-between row-baseline' : 'row-center'
                    ]"
                >
                    <slot name="title"></slot>
                    <button
                        v-if="showCloseButton"
                        class="transparent-button ph-2"
                        @click="$emit('close')"
                    >
                        <close-icon class="i-darkgrey"/>
                    </button>
                </div>
                <div>
                    <slot name="description"></slot>
                </div>
            </div>
            <div class="modal-body">
                <slot name="body"></slot>
            </div>
            <div class="modal-footer">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import { CloseIcon } from '@/icons';

export default {
    name: 'Modal',
    components: {
        CloseIcon
    },
    emits: ['close'],
    props: {
        showCloseButton: {
            type: Boolean,
            default: true
        },
        closeModalOnBackdropClicked: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        closeModaleventEmitter() {
            if(!this.closeModalOnBackdropClicked) {
                return;
            }

            this.$emit('close');
        }
    }
}
</script>
