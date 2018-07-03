<template>
    <div id="contentDescPage">
        <div class="common-alert-block p-center">
            <AlertComponent v-bind:key="item.key" v-for="item in alertComponentList" :className="item.className" :msg="item.text"></AlertComponent>
        </div>
        <Nav></Nav>
        <div class="content-desc-page-top common-page-top b-sizing t-left pf clearfix">
            <router-link to="/content"><i class="dlb vtm icon-back p-pointer add-class-btn"></i></router-link>
            <span class="dlb vtm" style="margin-left: 10px">AR内容</span>
            <button type="button" class="dlb vtm common-delete-btn-style fr p-pointer" @click="deleteContent">删除</button>
            <button type="button" class="dlb vtm common-confirm-btn-style fr p-pointer">编辑</button>
        </div>
        <div id="commonTips" v-if="isTips">
            <div :is="tipComponent"
                 msg="确认删除该AR内容"
                 v-on:listenCancelDelete="deleteContentRequest"
                 v-on:listenHideEvent="hideTipe">
            </div>
        </div>
        <div v-bind:key="item.info.uuid" class="content-desc-main" v-for="item in contentObj">

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
                this.hideTipe()
            }

        }
    }
</script>

<style scoped>

</style>