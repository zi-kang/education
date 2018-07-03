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
                <input type="text" class="vtm t-left" placeholder="搜索AR内容名称" v-model="searchName" maxlength="30" @keyup.13='getContent(1)'>
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
            <div class="content-item-list-section clearfix">
                <div v-for="item in contentList" class="content-item active-btns t-left fl b-sizing">
                    <h4 class="ell">{{item.name}}</h4>
                    <router-link :to="{path: '/content/' + item.uuid}" class="db item-cover-image pr">
                        <img :src="item.preview" class="v-center db" alt="">
                    </router-link>
                </div>
                <ul v-show="totalPage > 1" id="commonPageNation" class="clearfix content-list-page fr">
                    <li class="fl" @click="pageChange(currentPage - 1)"> < </li>
                    <li class="fl" v-if="preEll" @click="pageChange(1)">1</li>
                    <li class="fl page-ell" v-if="preEll" @click="pageChange(currentPage - 5)">...</li>
                    <li class="fl" v-bind:class="{active: item === currentPage}" v-for="item in pageList" v-bind:key="item" @click="pageChange(item)">{{item}}</li>
                    <li class="fl page-ell" v-if="lastEll" @click="pageChange(currentPage + 5)">...</li>
                    <li class="fl" v-if="lastEll" @click="pageChange(totalPage)">{{totalPage}}</li>
                    <li class="fl" @click="pageChange(currentPage + 1)"> ></li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
    import config from '../config';
    import http from '../http';
    import Nav from '@/components/Nav.vue';
    import AlertComponent from '@/components/AlertComponent.vue';
    import pageNation from '../pageNation';

    const pageSize = 2;
    export default {
        name: "Content",
        data(){
          return {
              searchName: '',
              contentList: [],
              searchActive: false,
              currentPage: 1,
              totalPage: 1,
              contentCount: 0,
              alertComponentList: [],
              pageList: [],
              preEll: false,
              lastEll: false
          }
        },
        beforeCreate: function () {
            document.title = 'AR教育-AR内容';
            this.$store.dispatch('getStatus');
            let self = this;
            http.Http.get(config.Config.mypackagesCommon, {
                page: 1,
                size: pageSize,
                name: self.searchName
            }, msg => {
                self.contentCount = msg.count;
                self.currentPage = msg.page;
                self.totalPage = msg.pageCount;
                self.contentList = msg.rows;
                self.modifyPageList();
            }, err => {
                self.alertComponentActive('common-error-alert', err.responseJSON.message);
            });
        },
        components: {
            Nav,
            AlertComponent
        },
        methods:{
            getContent: function (page) {
                http.Http.get(config.Config.mypackagesCommon, {
                    page: page,
                    size: pageSize,
                    name: this.searchName
                }, msg => {
                    this.contentCount = msg.count;
                    this.currentPage = msg.page;
                    this.totalPage = msg.pageCount;
                    this.contentList = msg.rows;
                    this.modifyPageList();
                }, err => {
                    this.alertComponentActive('common-error-alert', err.responseJSON.message);
                });
            },
            deleteSearchName: function () {
                this.searchName = '';
                this.getContent(1);
            },
            alertComponentActive(className, text){
                this.alertComponentList.push({className, text});
                setTimeout(()=>{
                    this.alertComponentList.shift();
                }, 3000);
            },
            modifyPageList() {
                let pageObj = pageNation.PageNation.pageList(this.currentPage, this.totalPage);
                this.pageList = pageObj.pageList;
                this.preEll = pageObj.preEll;
                this.lastEll = pageObj.lastEll;
            },
            pageChange(page) {
                let selectPage = pageNation.PageNation.selectPage(page, this.currentPage, this.totalPage);
                console.log(selectPage);
                if(selectPage > 0) {
                    this.getContent(selectPage)
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .content-main{
        width: 100%;
        min-height: 500px;
    }
    .content-item-list-section{
        width: 1140px;
        height: auto;
        margin: 0 auto;
        font-size: 0;
        .content-item{
            width: 212px;
            height: 171px;
            margin: 20px 20px 0 0;
            padding: 10px;
            font-size: 20px;
            color: #a3a3a3;
            h4{
                height: 14px;
                margin-bottom: 30px;
                line-height: 14px;
                font-size: 14px;
                color: #333333;
            }
        }
        .content-item:nth-child(5n + 5){
            margin-right: 0;
        }
        .item-cover-image{
            width: 192px;
            height: 108px;
            margin: 0 auto;
            background-color: #F5F5F5;
            img{
                max-width: 192px;
                max-height: 108px;
            }
        }
    }
</style>