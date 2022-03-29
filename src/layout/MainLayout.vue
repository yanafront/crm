<template>
    <div class="main-layout">
        <nav-bar />
        <div class="main-layout_content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { NavBar } from '@/components';

export default {
    name: "MainLayout",
    components: {
        NavBar
    }
}
</script>
