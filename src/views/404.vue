<template>
    <div class="column-center s-align-5 w-100 ph-8">
        <div class="service-layout_stub column-center t-center">
            <p class="mb-20">
                <not-found-icon class="i-green"/>
            </p>
            <h1 class="f-24-black f-extrabold mb-6">Oops! <br /> Something is Missing</h1>
            <p class="f-14-darkgrey">We can’t seem to find the page that you’re looking for.</p>
            <p class="f-14-darkgrey opacity-5">Please use main menu or go back to main screen.</p>
            <p class="mt-30">
                <router-link
                    :to="{name: 'Profile'}"
                    class="primary-button"
                >
                    Back to Main
                </router-link>
            </p>
        </div>
    </div>
</template>

<script>
import { NotFoundIcon } from '@/icons';

export default {
    name: 'NotFound',
    components: {
        NotFoundIcon
    }
}
</script>
