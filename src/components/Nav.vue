<template>
    <div id="nav" class="clearfix">
        <div class="logo fl">
            <i class="dlb vtm icon-logo"></i>
            <span class="dlb vtm">视+ 教育平台</span>
        </div>
        <router-link to="/course" class="dlb nav-common">课程</router-link>
        <router-link to="/content" class="dlb nav-common">AR内容</router-link>
    </div>
</template>

<script>
    export default {
        name: "Nav"
    }
</script>

<style scoped>
    #nav{
        display: block;
        width: 100%;
        min-width: 1366px;
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        color: #ffffff;
        z-index: 10010;

        background: -moz-linear-gradient(to right,#34C2B0 100%,#00C0D5 100%);
        background: -webkit-gradient(to right, #34C2B0 100%,#00C0D5 100%);
        background: -webkit-linear-gradient(to right,#34C2B0 100%,#00C0D5 100%);
        background: -o-linear-gradient(to right,#34C2B0 100%,#00C0D5 100%);
        background: -ms-linear-gradient(to right,#34C2B0 100%,#00C0D5 100%);
        background: linear-gradient(to right,#34C2B0 100%,#00C0D5 100%);
        background-color: #34C2B0;
    }
    .logo{
        padding-left: 20px;
        height: 60px;
    }
    .icon-logo{
        width: 30px;
        height: 30px;
        margin-right: 10px;
        background: url('/static/image/icon/logo.png') 0 0 no-repeat;
        background-size: cover;
    }
    .logo span{
        height: 36px;
        line-height: 36px;
        font-size: 24px;
        color: #ffffff;
    }


    .nav-common:hover,
    .router-link-active{
        background:rgba(0,0,0,0.2);
    }
    .nav-common{
        width:180px;
        height:40px;
        line-height: 40px;
        font-size:18px;
        color: #fff;
        border-radius:20px;
    }
</style>