<template>
    <div class="home">
        <Nav></Nav>
        <img src="../assets/image/logo.png" @click="increment" class="db">
        <a href="javascript: void (0)" class="change-styly" data-name="hello" @click="changeName">更改全局名称为‘hello’</a>
        <a href="javascript: void (0)" class="change-styly" data-name="kunt" @click="changeName">更改全局名称为‘kunt’</a>
        <a href="javascript: void (0)" class="change-styly" data-name="huzikang" @click="changeName">恢复原始名称</a>
        <p @click="testClick">{{userName}}</p>
        <span>{{count}}</span>
        <HelloWorld msg="Welcome to Your Vue.js App"/>
        <router-link to="/home/test">二级路由测试</router-link>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Nav from '@/components/Nav.vue';
    import HelloWorld from '@/components/HelloWorld.vue';

    const $ = window.$

    export default {
        name: 'home',
        data: function(){
            return {
                // userName: this.$store.state.userName
                count: 1
            }
        },
        beforeCreate: function () {
            this.$store.dispatch('getStatus');
        },
        components: {
            HelloWorld,
            Nav
        },
        computed: {
            userName: function () {
                return this.$store.state.userName;
            }
        },
        methods: {
            increment: function () {
                this.$store.dispatch('increment');
            },
            changeName: function (e) {
                $(e.target).toggleClass('active').siblings('a').removeClass('active');
                this.$store.dispatch('setName', $(e.target).attr('data-name'));
            },
            testClick: function () {
                console.log(this.count);
                this.count++;
            }
        }
    }
</script>

<style scoped>
    img{
        margin: 0 auto 30px;
    }
    .change-styly{
        display: inline-block;
        margin: 0 10px;
        font-size: 18px;
        color: #00a0e9;
    }
    .active{
        color: #00f;
    }
</style>
