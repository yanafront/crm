<template>
    <div class="column-center pre-auth-container">
        <img
            class="retrev-logo-img"
            src="@/assets/images/LogoRetrev.png"
            alt="Logo Retrev"
        >
        <div class="pre-auth-buttons">
            <div class="row-between">
                <primary-button
                    @click="$router.push({ name: 'SignUp' })"
                    :class="[mScreen ? 'mr-20' : 'mr-50']"
                >
                    Sign Up
                </primary-button>
                <primary-button
                    @click="$router.push({ name: 'Login' })"
                >
                    Log In
                </primary-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PreAuthPage',
}
</script>
