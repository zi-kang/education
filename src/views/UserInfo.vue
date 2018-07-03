<template>
    <div id="userInfoPage" class="pr">
        <div  class="common-alert-block p-center">
            <AlertComponent v-for="item in alertComponentList" :className="item.className" :msg = "item.text"></AlertComponent>
        </div>
        <Nav></Nav>
        <div class="common-page-top b-sizing t-left pr">
            <span class="dlb vtm class-name">账户信息</span>
        </div>
        <div class="user-info-main t-left">
            <div class="info-common-section-title">用户名</div>
            <div class="static-info-common ell">{{userName}}</div>
            <div class="info-common-section-title">手机号</div>
            <div class="static-info-common">{{userTpl}}</div>
            <div class="info-common-section-title">修改密码</div>
            <div class="pwd-common pwd-common1">旧密码</div>
            <input type="password" class="old-password b-sizing" maxlength="20" placeholder="请输入旧密码" v-model="oldPwd">
            <div class="pwd-common">新密码</div>
            <input type="password" class="new-password b-sizing" maxlength="20" placeholder="请输入新密码" v-model="newPwd">
            <div class="pwd-common">确认新密码</div>
            <input type="password" class="confirm-password b-sizing" maxlength="20" placeholder="请再次输入新密码" v-model="confirmPwd">
            <button type="button" class="p-pointer" @click="confirmChange">保存</button>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
    // 引入 axios
    import axios from 'axios'
    import config from '../config';
    import http from '../http';
    import AlertComponent from '@/components/AlertComponent.vue';
    import Nav from '@/components/Nav.vue';
    import Footer from '@/components/Footer.vue';
    export default {
        name: "UserInfo",
        data(){
          return {
              alertComponentList: [],
              oldPwd: '',
              newPwd: '',
              confirmPwd: ''
          }
        },
        beforeCreate: function () {
            document.title = 'AR教育-课程';
            this.$store.dispatch('getStatus');
        },
        components: {
            Nav,
            AlertComponent,
            Footer
        },
        computed:{
            userName: function () {
                return this.$store.state.userName
            },
            userTpl: function () {
                return this.$store.state.userTel
            }
        },
        methods:{
            alertComponentActive(className, text){
                this.alertComponentList.push({className, text});
                this.removeLastComponent();
            },
            removeLastComponent(){
                setTimeout(()=>{
                    this.alertComponentList.shift();
                }, 3000);
            },
            confirmChange(){
               let oldLength = this.oldPwd.length,
                   newLength = this.newPwd.length,
                   confirmLenght = this.confirmPwd.length;
                if (oldLength === 0 || newLength === 0 || confirmLenght === 0) {
                    this.alertComponentActive('common-error-alert', '密码不能为空')
                } else if (oldLength < 6 || newLength < 6 || confirmLenght < 6){
                    this.alertComponentActive('common-error-alert', '密码不能小于6位')
                } else if (this.newPwd != this.confirmPwd) {
                    this.alertComponentActive('common-error-alert', '两次密码不一致')
                } else {
                    this.changePwdRequest()
                }
            },
            changePwdRequest(){
                http.Http.put('https://global.easyar.cn/user/update/password', {
                    oldPassword: this.oldPwd,
                    newPassword: this.newPwd,
                    token: localStorage['educationToken']
                }, msg => {
                    this.alertComponentActive('common-success-alert', msg.message);
                }, err => {
                    this.alertComponentActive('common-error-alert', err.responseJSON.message);
                })
            }
        }
    }
</script>

<style scoped>
    #userInfoPage{
        min-height: 100%;
        padding-bottom: 40px;
    }
    .user-info-main{
        width: 380px;
        margin: 0 auto;
        font-size: 0;
    }
    .info-common-section-title{
        height: 28px;
        margin: 30px 0 10px;
        line-height: 28px;
        font-size: 20px;
        color: #34C2B0;
    }
    .static-info-common{
        max-width: 380px;
        height:33px;
        line-height: 33px;
        font-size:24px;
        color:rgba(51,51,51,1);
    }
    .pwd-common{
        height:14px;
        margin: 20px 0 10px;
        line-height:14px;
        font-size:14px;
        color:rgba(51,51,51,1);
    }
    .pwd-common1{
        margin-top: 10px;
    }
    input{
        width:380px;
        height:40px;
        padding: 0 10px;
        line-height: 40px;
        font-size: 14px;
        color: #a3a3a3;
        background:rgba(255,255,255,1);
        box-shadow:0 2px 10px 0 rgba(230,232,244,1);
        border-radius:5px;
    }
    button{
        width:220px;
        height:40px;
        display: block;
        margin: 30px auto 0;
        line-height: 40px;
        font-size: 18px;
        color: #ffffff;
        background:rgba(52,194,176,1);
        box-shadow:0 5px 10px 0 rgba(167,255,235,0.7);
        border-radius:20px;
    }
</style>