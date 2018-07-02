<template>
    <div id="contentListTip" class="v-center b-sizing">
        <div class="common-alert-block p-center">
            <AlertComponent v-for="item in alertComponentList" :className="item.className" :msg="item.text"></AlertComponent>
        </div>
        <h1 class="pr t-left">
            添加AR内容
            <i class="dlb p-middle icon-close-tip p-pointer" @click="hideTip"></i>
        </h1>
        <div class="select-content-name-block page-search-common">
            <i class="dlb vtm icon-search"></i>
            <input type="text" class="vtm t-left" placeholder="搜索AR内容名称" v-model="searchName" maxlength="30" @keyup.13='getContentList(1)'>
            <i v-if="searchName.length > 0" class="dlb vtm icon-search_delete p-pointer" @click="deleteSearchName"></i>
        </div>
        <ul class="clearfix select-content-list-common select-nav">
            <li class="fl nav-items t-left">名称</li>
            <li class="fl nav-items t-right">创建时间</li>
        </ul>
        <ul class="clearfix select-content-list-common" v-for="item in contentList">
            <li class="fl pr t-left item-name" >
                <i v-show="selectedUuid == item.uuid" class="dlb icon-yes p-middle p-pointer"></i>
                <i v-show="selectedUuid!= item.uuid" class="dlb icon-oval p-middle p-pointer" @click="selectItem(item.uuid)"></i>
                <div class="content-item-pre dlb vtm pr">
                    <img :src="item.preview" alt="" class="v-center">
                </div>
                <span class="dlb vtm ell">{{item.name}}</span>
            </li>
            <li class="fl t-right">{{item.addTime}}</li>
        </ul>
        <div class="bottom-section t-left clearfix">
            <button class="common-confirm-btn-style t-center p-pointer" @click="confirmselect">选择</button>
            <button class="common-cancel-btn-style t-center p-pointer" @click="hideTip">取消</button>
            <ul v-show="totalPage > 1" id="commonPageNation" class="clearfix content-list-page fr">
                <li class="fl" @click="pageChange(page - 1)"> < </li>
                <li class="fl" v-if="preEll" @click="pageChange(1)">1</li>
                <li class="fl page-ell" v-if="preEll" @click="pageChange(page - 5)">...</li>
                <li class="fl" v-bind:class="{active: item === page}" v-for="item in pageList" v-bind:key="item" @click="pageChange(item)">{{item}}</li>
                <li class="fl page-ell" v-if="lastEll" @click="pageChange(page + 5)">...</li>
                <li class="fl" v-if="lastEll" @click="pageChange(totalPage)">{{totalPage}}</li>
                <li class="fl" @click="pageChange(page + 1)"> ></li>
            </ul>
        </div>
    </div>
</template>

<script>
    import AlertComponent from '@/components/AlertComponent.vue'

    import config from '../config';
    import http from '../http';
    import pageNation from '../pageNation';

    const pageSize = 5;

    export default {
        name: "ContentList",
        data() {
            return {
                page: 1,
                totalPage: 1,
                pageSize: pageSize,
                contentList: [],
                alertComponentList: [],
                tipComponent: null,
                preEll: false,
                lastEll: true,
                pageList: [],
                searchName: '',
                selectedUuid: '111111'
            }
        },
        beforeCreate: function () {
            console.log('AR内容弹框')
            let self = this;
            self.$store.dispatch('loading');
            http.Http.get(config.Config.mypackagesCommon, {
                page: 1,
                size: pageSize
            }, msg => {
                self.$store.dispatch('removeLoading');
                self.page = msg.page;
                self.totalPage = msg.pageCount;
                self.contentList = msg.rows;
                self.modifyPageList();
            }, err => {
                self.$store.dispatch('removeLoading');
                self.alertComponentActive('common-error-alert', err.responseJSON.message);
            });
        },
        components: {
            AlertComponent
        },
        computed: {
            count() {
                return this.totalPage
            },
            currentPage() {
                return this.page
            }
        },
        methods: {
            getContentList(page) {
                this.selectedUuid = '';
                this.$store.dispatch('loading');
                http.Http.get(config.Config.mypackagesCommon, {
                    page: page,
                    size: pageSize,
                    name: this.searchName
                }, msg => {
                    this.$store.dispatch('removeLoading');
                    this.page = msg.page;
                    this.totalPage = msg.pageCount;
                    this.contentList = msg.rows;
                }, err => {
                    this.$store.dispatch('removeLoading');
                    this.alertComponentActive('common-error-alert', err.responseJSON.message);
                });
            },
            pageChange(page) {
                let selectPage = pageNation.PageNation.selectPage(page, this.page, this.totalPage);
                console.log(selectPage);
                if(selectPage > 0) {
                    this.getContentList(page)
                }
            },
            alertComponentActive(className, text) {
                this.alertComponentList.push({className, text});
                setTimeout(() => {
                    this.alertComponentList.shift();
                }, 3000);
            },
            hideTip() {
                this.$emit("listenHideEvent", {});
            },
            modifyPageList() {
                let pageObj = pageNation.PageNation.pageList(this.currentPage, this.totalPage);
                this.pageList = pageObj.pageList;
                this.preEll = pageObj.preEll;
                this.lastEll = pageObj.lastEll;
            },
            deleteSearchName(){
                this.searchName = '';
                this.getContentList(1);
            },
            confirmselect(){
                this.$emit("listenselectEvent", this.selectedUuid)
            },
            selectItem(uuid){
                this.selectedUuid = uuid
            }
        }
    }
</script>

<style scoped lang="less">
    #contentListTip {
        width: 780px;
        height: 524px;
        padding: 20px;
        background-color: #fff;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        h1 {
            height: 24px;
            line-height: 24px;
            font-size: 24px;
            color: #666666;
            i {
                right: 0;
            }
        }
        .select-content-name-block{
            margin: 25px 0 10px;
        }
        .select-content-list-common{
            line-height: 54px;
            font-size: 0;
            border-bottom: 1px solid #E6E8F4;
            li{
                height: 54px;
                font-size: 14px;
                color: #666666;
            }
            .item-name{
                font-size: 0;
                span{
                    text-indent: 10px;
                    font-size: 14px;
                    color: #666666;
                    max-width: 500px;
                }
                i{
                    left: 0;
                }
            }
            li:nth-child(1){
                width: 620px;
                text-indent: 40px;
            }
            li:nth-child(2){
                width: 120px;
            }
            .content-item-pre{
                width: 60px;
                height: 34px;
                background-color: #F5F5F5;
                img{
                    max-width: 60px;
                    max-height: 34px;
                }
            }
        }
        .select-nav{
            line-height: 40px;
            li{
                height: 40px;
            }
        }

        .bottom-section{
            margin-top: 20px;
            button{
                width: 120px;
            }
            button:nth-child(1){
                margin-right: 10px;
            }
        }

        .content-list-page{
        }
    }
</style>