<template>
    <label :class="[
        'checkbox',
        { 'checkbox-reverse' : labelDirection == 'left' }
    ]">
        <slot name="default"></slot>
        <span :class="['checkbox-mark', color ]"/>
        <slot name="image"></slot>
        <span
            :class="[
                'checkbox-label',
                labelNoWrap && 'no-wrap',
                { 'mr-4' : labelDirection == 'left' },
                labelClass
            ]"
            v-if="label"
        >
            {{ label }}
        </span>
    </label>
</template>

<script>
export default {
    name: 'CheckboxButton',
    props: {
        color: {
            type: [String],
            default: 'grey'
        },
        label: {
            type: [String],
            default: ''
        },
        labelDirection: {
            type: String,
            default: 'right'
        },
        labelNoWrap: {
            type: Boolean,
            default: false
        },
        labelClass: {
            type: [String, Array]
        }
    }
}
</script>
