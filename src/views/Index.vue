<template>
    <div id="indexPage">
        <div id="indexMain" class="index-page-main"></div>
        <div class="index-page-main index-page-main-content t-center">
            <img src="../assets/image/logo.png" alt="" class="db index-page-logo">
            <h4>视+AR教育</h4>
            <h6>让知识跃然纸上</h6>
            <a href="//passport.sightp.com/v4/login.html" v-if="!isLogin" class="loginBtn" target="_blank">登录</a>
            <div class="user-block pr" v-else>
                <div class="user-logo pr">
                    <img :src="userImage" alt="logo-user" onerror="this.src='static/image/default_user.png'" id="userLogo" class="v-center">
                </div>
                <div class="user-name ell">{{userName}}</div>
                <div class="pa authority-error" v-if="!hasRight">该账户暂无权限，请联系视+开通</div>
                <router-link to="/course"  v-if="hasRight">进入控制台</router-link>
                <a href="javascript: void(0)" class="dlb" v-else>进入控制台</a>
            </div>
        </div>
    </div>
</template>

<script>
    const $ = window.$;
    export default {
        name: "Index",
        data: function () {
            return {
                isLogin: false,
                userName: '',
                tpl: '',
                userImage: 'static/image/default_user.png'
            }
        },
        created: function () {
            document.title = 'AR教育-登录';
            let self = this;
            console.log($)
            $.ajax({
                url: "//passport.sightp.com/v4/token",
                type: "get",
                cache: false,
                dataType: "jsonp",
                jsonp: "callback", //这里定义了callback的参数名称，以便服务获取callback的函数名即getMessage
                jsonpCallback: "getMessage", //这里定义了jsonp的回调函数
                beforeSend: (xhr) => {
                    xhr.setRequestHeader("Authorization", localStorage['educationToken']);
                },
                success: function (msg) {
                    self.isLogin = true;
                    self.userName = msg.username;
                    self.userImage = '//sightpimage-cdn.sightp.com/avatar/' + msg.userId + '_middle.jpg';
                    localStorage.educationToken = msg.token;
                    self.$store.dispatch('getRight');
                },
                error: function () {
                    localStorage.educationToken = '';
                }
            });
        },
        computed: {
            hasRight: function () {
                return this.$store.state.hasRight
            }
        }
    }
</script>

<style scoped>
    #indexPage {
        width: 100%;
        height: 100%;
        min-height: 800px;
        background: url("../assets/image/bg.jpg") 0 0 no-repeat;
        background-size: 100%;
    }

    .index-page-main {
        position: fixed;
        top: 0;
        right: 0;
        width: 430px;
    }

    #indexMain {
        height: 100%;
        min-height: 800px;
        position: fixed;
        background: -moz-linear-gradient(#0084C9, #00D0C6, #00C998);
        background: -webkit-gradient(#0084C9, #00D0C6, #00C998);
        background: -webkit-linear-gradient(#0084C9, #00D0C6, #00C998);
        background: -o-linear-gradient(#0084C9, #00D0C6, #00C998);
        background: -ms-linear-gradient(#0084C9, #00D0C6, #00C998);
        background: linear-gradient(#0084C9, #00D0C6, #00C998);
        background-color: #34C2B0;
        opacity: 0.9;
        z-index: 100;
    }

    .index-page-main-content {
        height: 800px;
        position: absolute;
        z-index: 200;
    }

    .index-page-logo {
        width: 140px;
        height: 140px;
        margin: 80px auto 25px;
        border: 0 none;
    }

    h4 {
        margin-bottom: 10px;
        line-height: 65px;
        font-size: 48px;
        color: #ffffff;
    }

    h6 {
        line-height: 28px;
        font-size: 20px;
        color: #ffffff;
    }

    a {
        display: inline-block;
        width: 300px;
        height: 50px;
        line-height: 50px;
        font-size: 24px;
        color: #34C2B0;
        background: #ffffff;
        border-radius: 25px;
    }

    a:hover {
        background-color: #F5F5F5;
    }

    .loginBtn {
        margin-top: 230px;
    }

    .user-block {
        margin-top: 100px;
    }

    .user-logo {
        width: 60px;
        height: 60px;
        margin: 0 auto;
        background-color: #8D8D8D;
        border-radius: 30px;
    }

    .user-logo img {
        display: block;
        max-width: 60px;
        max-height: 60px;
        border: 0 none;
    }

    .user-name {
        height: 33px;
        margin: 15px 0 60px;
        line-height: 33px;
        font-size: 24px;
        color: #ffffff;
    }

    .authority-error {
        top: 120px;
        right: 0;
        left: 0;
        height: 25px;
        line-height: 25px;
        font-size: 18px;
        color: #F8E71C;
    }
</style>