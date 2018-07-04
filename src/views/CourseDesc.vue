<template>
    <div id="courseDesc" class="pr">
        <div class="common-alert-block p-center">
            <AlertComponent v-bind:key="item.key" v-for="item in alertComponentList" :className="item.className" :msg="item.text"></AlertComponent>
        </div>
        <Nav class="pf"></Nav>
        <div class="course-desc-page-top common-page-top b-sizing t-left pf clearfix">
            <router-link to="/course"><i class="dlb vtm icon-back p-pointer add-class-btn"></i></router-link>
            <span class="dlb vtm" style="margin-left: 10px">课程详情</span>
            <button type="button" class="dlb vtm common-delete-btn-style fr p-pointer" @click="deleteCourse">删除</button>
            <router-link :to="{path: '/course/modify/' + uuid}" class="dlb vtm common-confirm-btn-style t-center fr p-pointer">编辑</router-link>
        </div>
        <div class="course-desc-nav pf b-sizing">
            <a href="#all" class="db b-sizing" v-bind:class="{active: isActive == 1}" @click="changeShowBlock(1)">总览</a>
            <a href="#desc" class="db b-sizing" v-bind:class="{active: isActive == 2}"
               @click="changeShowBlock(2)">课程描述</a>
            <a href="#content" class="db b-sizing" v-bind:class="{active: isActive == 3}" @click="changeShowBlock(3)">课程内容</a>
        </div>
        <div v-for="item in courseObj" class="course-desc-main b-sizing pa" v-bind:key="item.uuid">
            <div id="all" class="pa"></div>
            <div id="desc" class="pa"></div>
            <div id="content" class="pa"></div>
            <div id="coursePre" class="clearfix">
                <div class="course-pre-left fl pr t-left b-sizing">
                    <h1>{{item.course.name}}</h1>
                    <div class="course-type">
                        <img :src="courseTypeImg" alt="" class="dlb vtm">
                        <span class="dlb vtm">{{courseTypeName}}</span>
                    </div>
                    <div class="course-pre-bottom pa">
                        <span>{{addTime}}</span>
                        <i class="dlb vtm fr icon-code p-pointer" @click="getCode(item.course.code)"></i>
                        <span class="code-num dlb vtm fr">{{item.course.code}}</span>
                    </div>
                </div>
                <div class="course-pre-right fl pr">
                    <img :src="item.course.preview" class="v-center" alt="">
                </div>
            </div>
            <p class="course-desc-common-title">课程描述</p>
            <div class="course-desc-section b-sizing t-left" v-html="item.course.intro">{{item.course.intro}}</div>
            <p class="course-desc-common-title">课程内容</p>
            <div v-bind:key="pack.name" v-for="pack in item.packages"
                 class="course-content-section t-left b-sizing clearfix">
                <div class="course-content-left fl">
                    <h4 class="ell">{{pack.name}}</h4>
                    <div class="content-desc">{{pack.intro}}</div>
                </div>
                <div class="course-content-right fl">
                    <div class="cover-image pr">
                        <img :src="pack.preview" alt="" class="v-center">
                    </div>
                    <router-link :to="{path: '/content/'+ pack.uuid}" class="db t-center common-confirm-btn-style">
                        查看AR内容
                    </router-link>
                </div>
            </div>
            <Footer></Footer>
        </div>
        <div id="commonTips" v-if="isTips">
            <div :is="tipComponent"
                 :code="activeCode"
                 msg="确认删除该课程"
                 v-on:listenCancelDelete="deleteCourseRequest"
                 v-on:listenHideEvent="hideTipe">
            </div>
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
    import Footer from '@/components/Footer.vue';

    export default {
        name: "CourseDesc",
        data() {
            return {
                alertComponentList: [],
                uuid: '',
                isActive: 1,
                courseObj: [],
                preview: '/static/image/empty_cover.jpg',
                tipComponent: null,
                activeCode: '',
                isTips: false
            }
        },
        components: {
            Nav,
            AlertComponent,
            GetCode,
            AlertTip,
            Footer
        },
        mounted() {
            this.uuid = window.location.pathname.split('course/').pop();
            this.$store.dispatch('getStatus');
            this.$store.dispatch('getCategories');
            this.getCourseDesc();
        },
        computed: {
            courseTypeName: function () {
                let courseTypeList = this.$store.state.categories;
                let typeName = '';
                for (let i = 0, j = courseTypeList.length; i < j; i++) {
                    if (courseTypeList[i].id === this.courseObj[0].course.categoryId) {
                        typeName = courseTypeList[i].name;
                        break;
                    }
                }
                return typeName
            },
            courseTypeImg: function () {
                let ids = parseInt(this.courseObj[0].course.categoryId);
                let typeImg = this.$store.state.staticImage[ids];
                return typeImg
            },
            addTime: function () {
                return common.Common.getTime(this.courseObj[0].course.addTime)
            }
        },
        methods: {
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
            getCourseDesc() {
                this.$store.dispatch('loading');
                http.Http.get(config.Config.getClassList + '/' + this.uuid, '', msg => {
                    this.$store.dispatch('removeLoading');
                    this.courseObj.push(msg);
                }, err => {
                    this.$store.dispatch('removeLoading');
                    this.alertComponentActive('common-error-alert', err.responseJSON.message);
                });
            },
            changeShowBlock(num) {
                this.isActive = num;
            },
            hideTipe() {
                this.isTips = false;
                this.tipComponent = null;
            },
            getCode(code) {
                this.activeCode = code;
                this.isTips = true;
                this.tipComponent = GetCode;
            },
            deleteCourse(){
                this.isTips = true;
                this.tipComponent = AlertTip;
            },
            deleteCourseRequest(){
                this.hideTipe();
                this.$store.dispatch('loading');
                http.Http.post(config.Config.getClassList + '/' + this.uuid + '/backup', '', msg => {
                    this.$store.dispatch('removeLoading');
                    this.alertComponentActive('common-success-alert', '删除成功');
                    setTimeout(() => {
                        window.location.href = '/course';
                    }, 100);
                }, err => {
                    this.$store.dispatch('removeLoading');
                    this.alertComponentActive('common-error-alert', err.responseJSON.message);
                });
            }
        }
    }
</script>
