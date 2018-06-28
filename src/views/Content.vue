<template>
    <div id="contentPage">
        <div  class="common-alert-block p-center">
            <AlertComponent v-for="item in alertComponentList" :className="item.className" :msg = "item.text"></AlertComponent>
        </div>
        <Nav></Nav>
        <!--全局搜索可以做一个组件的-->
        <div class="education-content-page-top common-page-top b-sizing t-left pr">
            <span class="dlb vtm class-name">AR内容</span>
            <router-link to="/content/addContent"><i class="dlb vtm icon-create p-pointer add-class-btn"></i></router-link>
            <div class="p-middle class-search-block page-search-common">
                <i class="dlb vtm icon-search"></i>
                <input type="text" class="vtm t-left" placeholder="搜索AR内容名称" v-model="searchName" maxlength="30" @keyup.13='getCourse'>
                <i v-if="searchName.length > 0" class="dlb vtm icon-search_delete p-pointer" @click="deleteSearchName"></i>
            </div>
        </div>
        <!--AR内容主题界面-->
        <div class="content-main pr">
            <div v-if="contentCount === 0" class="common-empty v-center">
                <img src="/static/image/empty_02.png" alt="" class="db">
                <router-link to="/content/addContent" class="add-common-item-btn add-course-item-btn dlb">
                    <i class="dlb vtm icon-add"></i>
                    <span class="dlb vtm">添加AR内容</span>
                </router-link>
            </div>

        </div>

    </div>
</template>

<script>
    import config from '../config';
    import http from '../http';
    import Nav from '@/components/Nav.vue';
    import AlertComponent from '@/components/AlertComponent.vue';

    export default {
        name: "content",
        data(){
          return {
              searchName: '',
              contentList: [],
              searchActive: false,
              currentPage: 1,
              totalPage: 1,
              contentCount: 0,
              alertComponentList: []
          }
        },
        beforeCreate: function () {
            document.title = 'AR教育-AR内容';
            this.$store.dispatch('getStatus');
            let self = this;
            http.Http.get(config.Config.mypackagesCommon, {
                page: 1,
                size: 20,
                name: self.searchName
            }, msg => {
                self.contentCount = msg.count;
                self.currentPage = msg.page;
                self.totalPage = msg.pageCount;
                self.contentList = msg.rows;
            }, err => {
                self.alertComponentActive('common-error-alert', err.responseJSON.message);
            });

        },
        components: {
            Nav,
            AlertComponent
        },
        methods:{
            getCourse: function () {

            },
            deleteSearchName: function () {

            },
            alertComponentActive(className, text){
                this.alertComponentList.push({className, text});
                this.removeLastComponent();
            },
            removeLastComponent(){
                setTimeout(()=>{
                    this.alertComponentList.shift();
                }, 3000);
            },
        }
    }
</script>

<style scoped>
    .content-main{
        width: 100%;
        min-height: 500px;
    }
</style>