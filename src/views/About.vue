<template>
  <div class="about">
    <Nav></Nav>
    <h1>This is an about page</h1>
    <router-link to="/about/test">Test</router-link>
    <router-view/>
  </div>
</template>

<script>
    import Nav from '@/components/Nav.vue';
    export default {
        name: 'about',
        components: {
            Nav
        }
    }
</script>