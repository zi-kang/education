<template>
    <div class="common-component" v-bind:class="className">{{msg}}</div>
</template>

<script>
    export default {
        name: "alertComponent",
        props: {
            msg: String,
            className: String
        }
    }
</script>

<style scoped>

</style>