<template>
    <div id="coursePage" class="pr">
        <div  class="common-alert-block p-center">
            <AlertComponent v-bind:key="item.key" v-for="item in alertComponentList" :className="item.className" :msg="item.text"></AlertComponent>
        </div>
        <Nav></Nav>
        <div class="education-class-page-top common-page-top b-sizing t-left pr">
            <span class="dlb vtm class-name">课程</span>
            <router-link to="/course/addCourse"><i class="dlb vtm icon-create p-pointer add-class-btn"></i></router-link>
            <div class="p-middle class-search-block page-search-common">
                <i class="dlb vtm icon-search"></i>
                <input type="text" class="class-name-search-input vtm t-left" placeholder="搜索课程名称" v-model="searchName"
                       maxlength="30" @keyup.13='getCourse(1)'>
                <i v-if="searchName.length > 0" class="dlb vtm icon-search_delete p-pointer delete-search-name-btn"
                   @click="deleteSearchName"></i>
            </div>
        </div>
        <div class="class-type-nav pa-l t-left">
            <a href="javascript: void (0)" class="db b-sizing select-class-type-btn" v-bind:class="{ active: activeType == '-1' }" @click="changeType(-1)">全部课程</a>
            <a v-bind:key="item.id" v-for="item in categories" href="javascript: void (0)"
               class="db ell b-sizing select-class-type-btn"
                v-bind:class="{ active: activeType == item.id }" @click="changeType(item.id)">
                <img :src="staticImage[item.id]" alt="" class="vtm img-static">
                <img :src="colorImage[item.id]" alt="" class="vtm img-active">
                <span class="dlb ell vtm">{{item.name}}</span>
            </a>
        </div>
        <div class="class-page-right b-sizing pr">
            <div class="course-empty v-center common-empty" v-if="searchActive && courseRows.length === 0">
                <img src="../assets/image/course-empty.png" alt="" class="db empty-course-img">
                <span class="db empty-text">没有找到相应课程</span>
            </div>
            <div class="course-empty common-empty v-center" v-else-if="!searchActive && courseRows.length === 0">
                <img src="../assets/image/course-empty.png" alt="" class="db empty-course-img">
                <span class="db empty-text">还没有任何课程</span>
                <router-link to="/course/addCourse" class="add-common-item-btn add-course-item-btn dlb">
                    <i class="dlb vtm icon-add"></i>
                    <span class="dlb vtm">创建课程</span>
                </router-link>
            </div>
            <div v-bind:key="item.code" v-for="item in courseRows" class="course-list-item active-btns fl b-sizing clearfix t-left active-btns pr">
                <h4 class="ell">{{item.name}}</h4>
                <i class="code-common-code dlb pa icon-code p-pointer" @click="getCode(item.code)"></i>
                <i class="dlb pa vtm icon-menu icon-menu-style"></i>
                <span class="course-type dlb vtm">{{item.categoryName}}</span>
                <div class="pre-image pr">
                    <img :src="item.preview" alt="" class="db v-center">
                </div>
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
        <div id="commonTips" v-if="isTips">
            <div :is="tipComponent"
                 :code="activeCode"
                 v-on:listenHideEvent="hideTipe">
            </div>
        </div>
    </div>
</template>

<script>
    import config from '../config';
    import http from '../http';
    import Nav from '@/components/Nav.vue';
    import AlertComponent from '@/components/AlertComponent.vue';
    import GetCode from '@/components/GetCode.vue';
    import pageNation from '../pageNation';

    const pageSize = 2;

    export default {
        name: "course",
        data: function () {
            return {
                courseCount: 0,
                courseRows: [],
                alertComponentList: [],
                activeType: '-1',
                searchName: '',
                searchActive: false,
                currentPage: 1,
                totalPage: 1,
                pageList: [],
                preEll: false,
                lastEll: false,
                tipComponent: null,
                isTips: false,
                activeCode: ''
            }
        },
        beforeCreate: function () {
            document.title = 'AR教育-课程';
            this.$store.dispatch('getStatus');
        },
        created: function () {
            let self = this;
            self.$store.dispatch('getCategories');
            http.Http.get(config.Config.getClassList, {
                page: 1,
                size: pageSize
            }, msg => {
                self.courseCount = msg.count;
                self.courseRows = msg.rows;
                self.currentPage = msg.page;
                self.totalPage = msg.pageCount;
                self.modifyPageList();
            }, err => {
                self.alertComponentActive('common-error-alert', err.responseJSON.message);
            });
        },
        components: {
            Nav,
            AlertComponent,
            GetCode
        },
        computed: {
            categories: function () {
                return this.$store.state.categories
            },
            staticImage: function () {
                return this.$store.state.staticImage
            },
            colorImage: function () {
                return this.$store.state.colorImage
            },
        },
        methods: {
            errorAlert(text){
              this.alertComponentActive('common-error-alert', text)
            },
            alertComponentActive(className, text){
                let key = (new Date()).getTime();
                this.alertComponentList.push({className, text, key});
                setTimeout(()=>{
                    this.alertComponentList.shift();
                }, 3000);
            },
            getCourse: function (page) {
                let params = {
                    page: page,
                    size: pageSize
                };
                this.searchActive = false;
                if(this.searchName.trim().length != 0) {
                    params.name = this.searchName;
                    this.searchActive = true;
                }
                if(this.activeType != '-1') {
                    params.categoryId = this.activeType;
                }
                http.Http.get(config.Config.getClassList, params, msg => {
                    this.courseCount = msg.count;
                    this.courseRows = msg.rows;
                    this.currentPage = msg.page;
                    this.totalPage = msg.pageCount;
                    this.modifyPageList();
                }, err => {
                   this.alertComponentActive('common-error-alert', err.responseJSON.message);
                });
            },
            changeType: function (typeId) {
                this.activeType = typeId;
                this.getCourse(1);
            },
            deleteSearchName: function () {
                this.searchName = '';
                this.getCourse(1);
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
                    this.getCourse(selectPage)
                }
            },
            hideTipe(){
                this.isTips = false;
                this.tipComponent = null;
            },
            getCode(code){
                this.activeCode = code;
                this.isTips = true;
                this.tipComponent = GetCode;
            }
        }
    }
</script>
