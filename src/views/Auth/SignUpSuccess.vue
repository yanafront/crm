<template>
    <div class="column-center s-align-5 w-100 ph-8">
        <div class="service-layout_stub column-center t-center">
            <h1 class="f-24-black f-extrabold mb-6">Your account has been created!</h1>
            <p class="f-14-darkgrey">Please check your email and click on the confirmation link to verify your email address.</p>
            <p class="f-14-darkgrey">If you have not received  a confirmation email, please check your spam folder.</p>
            <p class="mt-30">
                <router-link
                    :to="{name: 'Login'}"
                    class="primary-button"
                >
                    Login
                </router-link>
            </p>
        </div>
    </div>
</template>

<script>

export default {
    name: 'SignUpSuccess'
}
</script>
