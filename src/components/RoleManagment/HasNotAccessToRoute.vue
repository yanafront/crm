<template>
    <div class="column-center s-align-5 w-100 ph-8">
        <div class="service-layout_stub column-center t-center">
            <h1 class="f-24-black f-extrabold mb-6">Oops! <br /> You do not have access to Pro features.</h1>
            <p class="f-14-darkgrey">You can get access by clicking Upgrade to Pro.</p>
            <p class="mt-30">
                <router-link
                    :to="{name: 'Products'}"
                    class="primary-button"
                >
                    Upgrade to Pro
                </router-link>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HasNotAccessToRoute',
}
</script>
