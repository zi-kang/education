<template>
    <div class="about">
        <h1 @click="getStatus">This is an test page</h1>
    </div>
</template>

<script>
    import Nav from '@/components/Nav.vue';
    export default {
        name: "test",
        methods: {
            getStatus () {
                this.$store.dispatch('getStatus')
            }
        }
    }
</script>

<style scoped>

</style>