<template>
    <div class="service-layout column-start">
        <div class="s-align-4 mt-25 ml-30">
            <div class="f-20-green f-extrabold service-layout_logo">Retrēv</div>
        </div>
        <div class="row-center h-100">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "ServiceLayout"
}
</script>
