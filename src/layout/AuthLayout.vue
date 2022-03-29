<template>
    <div class="auth-layout">
        <div class="auth-layout-aside">
            <div class="auth-layout-aside_logo">Retrēv</div>
        </div>
        <div class="auth-layout-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "AuthLayout"
}
</script>
