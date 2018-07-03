<template>
    <div id="contentDescPage">
        <div class="common-alert-block p-center">
            <AlertComponent v-bind:key="item.key" v-for="item in alertComponentList" :className="item.className" :msg="item.text"></AlertComponent>
        </div>
        <Nav></Nav>
        <div class="content-desc-page-top common-page-top b-sizing t-left clearfix">
            <router-link to="/content"><i class="dlb vtm icon-back p-pointer add-class-btn"></i></router-link>
            <span class="dlb vtm" style="margin-left: 10px">AR内容</span>
            <button type="button" class="dlb vtm common-delete-btn-style fr p-pointer" @click="deleteContent">删除</button>
            <router-link :to="{path: '/content/modify/' + uuid}" class="dlb vtm common-confirm-btn-style t-center fr p-pointer">编辑</router-link>
        </div>
        <div id="commonTips" v-if="isTips">
            <div :is="tipComponent"
                 msg="确认删除该AR内容"
                 v-on:listenCancelDelete="deleteContentRequest"
                 v-on:listenHideEvent="hideTipe">
            </div>
        </div>
        <div v-bind:key="item.info.uuid" class="content-desc-main t-left" v-for="item in contentObj">
            <h1 class="ell">{{item.info.name}}</h1>
            <span class="add-time">{{addTime}}</span>
            <div class="content-cover-section clearfix">
                <div class="cover-image pr fl">
                    <img :src="previewImg" alt="" class="v-center">
                </div>
                <div class="active-cover-img fr">
                    <div v-bind:key="image.uuid" v-for="image in item.photos" class="active-cover-img pr p-pointer" @click="changePriview(image.preview)">
                        <img :src="image.preview" alt="" class="v-center">
                    </div>
                </div>
            </div>
            <p class="section-title">课程内容</p>
            <div class="desc-block b-sizing">{{item.info.intro}}</div>
        </div>
    </div>
</template>

<script>
    import config from '../config';
    import http from '../http';
    import common from '../common';
    import Nav from '@/components/Nav.vue';
    import AlertComponent from '@/components/AlertComponent.vue';
    import GetCode from '@/components/GetCode.vue';
    import AlertTip from '@/components/AlertTip.vue';

    export default {
        name: "ContentDesc",
        data(){
          return {
              alertComponentList: [],
              uuid: '',
              isActive: 1,
              contentObj: [],
              preview: '/static/image/empty_cover.jpg',
              tipComponent: null,
              isTips: false
          }
        },
        components: {
            Nav,
            AlertComponent,
            GetCode,
            AlertTip
        },
        mounted() {
            document.title = 'AR教育-AR内容详情';
            this.uuid = window.location.pathname.split('content/').pop();
            this.$store.dispatch('getStatus');
            this.getContentDesc();
        },
        computed:{
            addTime: function () {
                return common.Common.getTime(this.contentObj[0].info.addTime)
            },
            previewImg: function () {
                return this.preview
            }
        },
        methods:{
            errorAlert(text) {
                this.alertComponentActive('common-error-alert', text)
            },
            alertComponentActive(className, text) {
                let key = (new Date()).getTime();
                this.alertComponentList.push({className, text, key});
                setTimeout(() => {
                    this.alertComponentList.shift();
                }, 3000);
            },
            hideTipe() {
                this.isTips = false;
                this.tipComponent = null;
            },
            getContentDesc: function () {
                this.$store.dispatch('loading');
                http.Http.get(config.Config.mypackagesCommon + '/' + this.uuid, '', msg => {
                    this.$store.dispatch('removeLoading');
                    this.contentObj.push(msg);
                    this.preview = msg.info.preview
                }, err => {
                    this.$store.dispatch('removeLoading');
                    this.alertComponentActive('common-error-alert', err.responseJSON.message);
                });
            },
            deleteContent(){
                this.isTips = true;
                this.tipComponent = AlertTip;
            },
            deleteContentRequest(){
                this.hideTipe();
                this.$store.dispatch('loading');
                http.Http.post(config.Config.mypackagesCommon + '/' + this.uuid + '/backup', '', () => {
                    this.$store.dispatch('removeLoading');
                    this.alertComponentActive('common-success-alert', '删除成功');
                    setTimeout(()=>{
                        window.location.href = '/content'
                    }, 100)
                }, err => {
                    this.$store.dispatch('removeLoading');
                    this.alertComponentActive('common-error-alert', err.responseJSON.message);
                });
            },
            changePriview(newPriview){
                this.preview = newPriview;
            }


        }
    }
</script>

<style scoped>

</style>