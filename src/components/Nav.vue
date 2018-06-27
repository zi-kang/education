<template>
    <div id="nav" class="clearfix">
        <div class="logo fl">
            <i class="dlb vtm icon-logo"></i>
            <span class="dlb vtm">视+ 教育平台</span>
        </div>
        <router-link to="/course" class="dlb nav-common common-nav-active">课程</router-link>
        <router-link to="/content" class="dlb nav-common common-nav-active">AR内容</router-link>
        <div class="user-center fr t-center pr">
            <a href="javascript: void(0)" id="userNameBtn" class="dlb p-pointer vtm ell common-nav-active"><i class="dlb icon-user-nav vtm"></i></a>
            <i class="dlb icon-user-down p-pointer vtm"></i>
            <div class="user-active-block anima pa">
                <i class="dlb pa icon-angel-up"></i>
                <a href="javascript: void(0)" id="userNameGlobal" class="db user-name-global" data-slide="true">
                    <span class="db user-name-common ell">{{userName}}</span>
                    <span class="ell dlb user-tel-common ell">{{userTel}}</span>
                </a>
                <router-link to="/userInfo" id="userInfoBtn" class="db" data-slide="true">账户信息</router-link>
                <a href= '//passport.sightp.com/login/logout?t=(new Date()).getTime()'  id="logOutBtn" class="db login-out">退出登录</a>
            </div>
        </div>
        <div class="private-right-height-nav fr">
            <router-link to="/home" class="fl b-sizing dlb common-nav-active manage-nav p-pointer pr">
                <i class="dlb icon-manage-icon"></i>
                <span class="pa-l">
                    <i class="dlb pa icon-angel-up"></i>
                    管理中心
                </span>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Nav",
        computed:{
            userName:function () {
                return this.$store.state.userName;
            },
            userTel:function () {
                return this.$store.state.count;
            }
        }
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


    .common-nav-active:hover,
    .common-nav-active.router-link-active{
        background:rgba(0,0,0,0.2);
    }
    #userInfoBtn.router-link-active{
        background-color: #fbfbfb;
        color: #34C2B0;
    }

    .nav-common{
        width:180px;
        height:40px;
        line-height: 40px;
        font-size:18px;
        color: #fff;
        border-radius:20px;
    }

    .user-center{
        margin-right: 20px;
        font-size: 0;
        z-index: 10;
    }
    .user-center:hover .user-active-block{
        height: auto;
        top: 50px;
        right: 0;
    }

    #userNameBtn{
        width: 40px;
        height: 40px;
        line-height: 40px;
        color: #ffffff;
        border-radius: 20px;
    }

    .user-active-block{
        height: 0;
        right: 0;
        padding-top: 11px;
        overflow: hidden;
    }

    .user-active-block a{
        width: 150px;
        height: 50px;
        line-height: 50px;
        text-indent: 15px;
        text-align: left;
        font-size: 14px;
        color: #666666;
        background-color: #fff;
        border: 1px solid #DCDDDD;
        border-top: 0 none;
    }
    .user-active-block a:hover{
        background-color: #fbfbfb;
        color: #34C2B0;
    }

    .user-active-block .icon-angel-up{
        top: 0;
        right: 10px;
    }

    a.user-name-global{
        font-size: 0;
    }
    .user-name-global span{
        max-width: 100%;
        line-height: 25px;
        font-size: 14px;
    }
    .user-active-block span i{
        margin-left: 14px;
    }

    .manage-nav{
        width: 40px;
        height: 40px;
        top: 9px;
        line-height: 40px;
        font-size: 15px;
        color: #ffffff;
        border-radius: 25px;
    }

    .manage-nav span{
        top: 51px;
        left: -20px;
        width: 80px;
        height: 25px;
        line-height: 25px;
        font-size: 16px;
        color: #333333;
        background-color: #ffffff;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
        display: none;
        z-index: 10;
    }
    .manage-nav i{
        margin: 0;
        vertical-align: middle;
    }
    .manage-nav:hover span i{
        top: -10px;
        left: 37px;
    }
    .manage-nav:hover span{
        display: inline-block;
    }




</style>