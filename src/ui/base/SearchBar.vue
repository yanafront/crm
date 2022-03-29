<template>
    <div
        class="search-bar relative transition-01"
        ref="searchBar"
    >
        <button
            class="transparent-button icon-light p-1"
            @click="showSearchBar"
            :disabled="disabled"
        >
            <search-icon
                size="15"
                class="i-grey"
            />
        </button>
        <transition name="search-bar" appear>
            <div
                v-if="isExpanded"
                class="search-bar-input row-between row-baseline"
                :style="`width: ${searchBarWidth}px`"
            >
                <search-icon
                    class="i-grey"
                    size="15"
                />
                <input
                    type="text"
                    :placeholder="placeholder"
                    ref="searchBarInput"
                    v-model="inputValue"
                    @input="$emit('input', $event.target.value)"
                >
                <button
                    class="transparent-button search-bar-close-btn icon-light"
                    @click="hideSearchbar"
                >
                    <close-icon
                        size="13"
                        class="i-grey"
                    />
                </button>
            </div>
        </transition>
    </div>
</template>

<script>
import { SearchIcon, CloseIcon } from '@/icons';

export default {
    name: 'SearchBar',
    components: {
        SearchIcon,
        CloseIcon
    },
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: 'Search item...'
        }
    },
    emits:['input', 'close'],
    data() {
        return {
            isExpanded: false,
            searchBarWidth: 0,
            inputValue: ''
        }
    },
    methods: {
        getInputWidth() {
            this.searchBarWidth = this.$refs.searchBar.parentNode.offsetWidth;
        },
        showSearchBar() {
            this.isExpanded = true;
            this.$nextTick(function() {
                this.$refs.searchBarInput.focus();
            });
        },
        hideSearchbar() {
            this.isExpanded = false;
            this.inputValue = '';
            this.$emit('close');
        },
        initSearchBar(value) {
            this.inputValue = value;
            this.isExpanded = true;
        }
    },
    mounted() {
        this.getInputWidth();
        window.addEventListener('resize', this.getInputWidth);
    },
    destroyed() {
        window.removeEventListener('resize', this.getInputWidth);
    }
}
</script>
