<template>
    <div
        class="custom-select"
        :tabindex="tabindex"
        @blur="open = false"
    >
        <div
            :class="[
                'selected',
                { 'open': open }
            ]"
            @click="open = !open"
        >
            {{ selected.title }}
        </div>
        <div
            :class="[
                'items',
                { 'select-hide': !open }
            ]"
        >
            <div
                class="item"
                v-for="(option, i) of availableOptions"
                :key="i"
                @click="selectItem(option)"
            >
                {{ option.title }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SelectInput',
    props:{
        options:{
            type: Array,
            required: true
        },
        default: {
            type: Object,
            required: true
        },
        tabindex:{
            type: Number,
            required: false,
            default: 0
        }
    },
    emits: ['input'],
    data() {
        return {
            selected: null,
            open: false
        };
    },
    computed: {
        availableOptions() {
            if (this.options && this.options.length) {
                return this.options.filter(el => !el.selected);
            } else {
                return [];
            }
        }
    },
    methods: {
        selectItem(option) {
            let data = {
                curentOption: option,
                prevOption: this.selected
            };

            this.$emit('input', data);
            this.selected = option;
            this.open = false;
        }
    },
    created() {
        let selectedOptions = this.options && this.options.length
            ? this.options.find(option => option.type === this.default.type)
            : [];

        if (selectedOptions && Object.keys(selectedOptions).length) {
            this.selected = selectedOptions;
        }
    }
}
</script>
