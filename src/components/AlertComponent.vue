<template>
    <div class="common-component-alert" v-bind:class="className">{{msg}}</div>
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
    .common-component-alert{
        width: auto;
        height: 30px;
        margin: 0 auto;
        padding: 0 30px;
        line-height: 30px;
        font-size: 14px;
        border-radius: 15px;
    }
</style>