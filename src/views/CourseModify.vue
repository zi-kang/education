<template>
    <div id="addCourseItemPage" class="pr common-page-style b-sizing" @click="globalClick">
        <div  class="common-alert-block p-center">
            <AlertComponent v-for="item in alertComponentList" :className="item.className" :msg = "item.text"></AlertComponent>
        </div>
        <Nav></Nav>
        <div class="education-class-page-top common-page-top b-sizing t-left pr">
            <router-link :to="{path: '/course/' + uuid}"><i class="dlb vtm icon-back p-pointer back-to-course"></i></router-link>
            <span class="dlb vtm class-name">课程详情</span>
        </div>
        <div class="add-course-main clearfix">
            <div class="add-top-left fl t-left">
                <p class="add-title-text-common">课程名称</p>
                <input type="text" v-model="courseName" class="course-name-input active-btns b-sizing" maxlength="30" placeholder="请输入课程名称">
                <p class="add-title-text-common">课程分类</p>
                <div class="select-course-type active-btns pr" v-bind:class="{'o-dn': !clickShow}" @click="selectTypeClick">
                    <span class="current-select active-btns p-pointer b-sizing">{{selectName}}</span>
                    <div class="categories-list pa">
                        <span v-for="item in categories" class="select-type-item-btn p-pointer b-sizing" :data-id="item.id" @click="selectItem">{{item.name}}</span>
                    </div>
                </div>
            </div>
            <div class="add-top-right fr">
                <p class="add-title-text-common">封面</p>
                <div class="add-cover-main active-btns">
                    <div class="cover-image-pre dlb fl pr">
                        <img :src="coverImage" alt="" class="db v-center">
                    </div>
                    <div class="add-cover-btns fl p-pointer b-sizing t-left pr">
                        <i class="dlb vtm icon-add"></i>
                        <span class="dlb vtm add-text">选择文件</span>
                        <span class="add-text-desc db">.jpg或.png格式的图片， 建议分辨</span>
                        <input type="file" class="common-input-file cover-image-input pa p-pointer" accept=".jpg, .png" @change="fileChange">
                    </div>
                </div>

            </div>
            <div class="clearfix"></div>
            <p class="add-title-text-common">课程描述</p>
            <div :is="EditorComponent"
                 v-on:listenChangeEvent="changeEditor"
                 :defaultHtml="descInfoHtml">
            </div>
            <!--<Editor v-on:listenChangeEvent="changeEditor" :defaultHtml="descInfoHtml"></Editor>-->
            <p class="add-title-text-common">课程内容</p>
            <div class="select-content-show pr active-btns clearfix b-sizing" v-for="item in selectContentItem">
                <i class="dlb pa icon-delete p-pointer" @click="deletContent(item.info.uuid)"></i>
                <div class="content-show-left fl">
                    <div class="content-show-cover pr">
                        <img :src="item.info.preview" alt="" class="v-center">
                    </div>
                    <span class="dlb t-left">{{item.info.name}}</span>
                </div>
                <div class="content-show-right fr">
                    <p class="add-title-text-common right-title">标题</p>
                    <input type="text" maxlength="30" class="b-sizing" v-model="courseTitleList[item.info.uuid]" placeholder="请输入标题">
                    <p class="add-title-text-common">描述</p>
                    <textarea  v-model="courseDescList[item.info.uuid]" class="db b-sizing" maxlength="500" placeholder="请输入内容描述" />
                </div>
            </div>
            <div class="active-btns select-content-block t-center p-pointer" @click="selectContent">
                <i class="dlb vtm icon-add"></i>
                <span class="dlb vtm">选择AR内容</span>
            </div>
            <a href="javascript: void (0)" class="dlb common-confirm-create-btns t-center p-pointer" @click="createCourse">保存</a>
            <Footer></Footer>
        </div>
        <div id="commonTips" v-if="isTips">
            <div :is="tipComponent"
                 msg="是否删除该AR内容？"
                 v-on:listenCancelDelete="confirmDelete"
                 v-on:listenselectEvent="confirmselect"
                 v-on:listenHideEvent="hideTipe">
            </div>
        </div>
    </div>
</template>

<script>
    import config from '../config';
    import http from '../http';
    import Nav from '@/components/Nav.vue';
    import Editor from '@/components/Editor.vue';
    import AlertComponent from '@/components/AlertComponent.vue';
    import ContentList from '@/components/ContentList.vue';
    import AlertTip from '@/components/AlertTip.vue';
    import Footer from '@/components/Footer.vue';
    export default {
        name: "CourseModify",
        data() {
            return {
                uuid: '',
                clickShow: false,
                courseName: '',
                selectTypeId: '',
                selectName: '请选择课程分类',
                descInfoText: '',
                descInfoHtml: '',
                selectedImageFile: '',
                coverImage: '/static/image/empty_cover.jpg',
                coverUuid: '',
                alertComponentList: [],
                isTips: false,
                tipComponent: null,
                EditorComponent: null,
                selectContentId: '',
                selectContentItem: [],
                courseTitleList: {},
                courseDescList:{}
            }
        },
        mounted() {
            document.title = 'AR教育-课程';
            this.$store.dispatch('getStatus');
            this.$store.dispatch('getCategories');
            this.uuid = window.location.pathname.split('modify/').pop();
            this.getCourseDesc();
        },
        components: {
            Nav,
            Editor,
            AlertComponent,
            ContentList,
            AlertTip,
            Footer
        },
        computed: {
            categories: function () {
                return this.$store.state.categories
            }
        },
        methods: {
            getCourseDesc(){
                this.$store.dispatch('loading');
                http.Http.get(config.Config.getClassList + '/' + this.uuid, '', msg => {
                    this.$store.dispatch('removeLoading');
                    this.courseName = msg.course.name;
                    this.selectTypeId = msg.course.categoryId;
                    this.coverImage = msg.course.preview;
                    this.coverUuid = msg.course.coverUuid;
                    this.descInfoHtml = msg.course.intro;
                    for (let i = 0, j = this.$store.state.categories.length; i < j; i++) {
                        if (this.$store.state.categories[i].id === msg.course.categoryId) {
                            this.selectName = this.$store.state.categories[i].name;
                            break;
                        }
                    }
                    for(let n = 0, m = msg.packages.length; n < m; n++) {
                        this.courseTitleList[msg.packages[n].uuid] =  msg.packages[n].name;
                        this.courseDescList[msg.packages[n].uuid] = msg.packages[n].intro;
                        let packages = {
                            info: msg.packages[n]
                        };
                        this.selectContentItem.push(packages);
                    }
                    this.EditorComponent = Editor;
                }, err => {
                    this.$store.dispatch('removeLoading');
                    this.alertComponentActive('common-error-alert', err.responseJSON.message);
                });
            },
            changeEditor(msg) {
                this.descInfoText = msg.text;
                this.descInfoHtml = msg.html;
            },
            globalClick() {
                this.clickShow = false;
            },
            selectTypeClick(ev) {
                this.$store.dispatch('clickStopPropagation', ev);
                this.clickShow = !this.clickShow;
            },
            selectItem(ev) {
                this.selectName = ev.target.innerText;
                this.selectTypeId = ev.target.getAttribute('data-id');
            },
            fileChange(e) {
                console.log(e.target.value);
                if(e.target.value === '') return;
                let selectFile = e.target.files[0];
                console.log(selectFile);
                e.target.value = '';
                let windowURL = window.URL || window.webkitURL;
                let fileType = selectFile.type.split('/').pop();
                if(fileType != 'png' && fileType != 'jpeg') {
                    this.errorAlert('请选择图片文件')
                } else if (this.selectedImageFile.size > 2097152 ){
                    this.errorAlert('请选择2M内的图片文件')
                } else {
                    this.coverUuid = '';
                    this.selectedImageFile = selectFile;
                    this.coverImage = windowURL.createObjectURL(this.selectedImageFile);
                }
            },
            createCourse() {
                if(this.courseName.trim() === '') {
                    this.errorAlert('请输入课程名称')
                } else if (this.selectTypeId === '') {
                    this.errorAlert('请选择课程分类')
                } else if (this.coverUuid === '') {
                    this.errorAlert('请选择封面')
                } else if (this.descInfoHtml.length === 0) {
                    this.errorAlert('请输入课程描述')
                } else if (this.descInfoText.length > 500) {
                    this.errorAlert('课程描述不能大于500个字符')
                } else if (JSON.stringify(this.courseTitleList) == "{}") {
                    this.errorAlert('请选择AR内容')
                } else if (!this.checkoutCourseTitle()) {
                    this.errorAlert('请输入课程内容标题')
                } else if (!this.checkoutCourseDesc()) {
                    this.errorAlert('请输入课程内容描述')
                } else {
                    this.uploadCoverToQiNiu();
                }
            },
            checkoutCourseTitle(){
                let charge = true;
                for(let name in this.courseTitleList) {
                    if(this.courseTitleList[name] === '') {
                        charge = false;
                    }
                }

                return charge
            },
            checkoutCourseDesc(){
                let charge = true;
                for(let desc in this.courseDescList) {
                    if(this.courseDescList[desc] === '') {
                        charge = false;
                    }
                }
                return charge
            },
            errorAlert(text){
                this.alertComponentActive('common-error-alert',text)
            },
            alertComponentActive(className, text){
                this.alertComponentList.push({className, text});
                setTimeout(()=>{
                    this.alertComponentList.shift();
                }, 3000);
            },
            hideTipe(){
                this.isTips = false;
                this.tipComponent = null;
            },
            selectContent(){
                this.isTips = true;
                this.tipComponent = ContentList;
            },
            confirmselect(uuid){
                this.selectContentId = uuid;
                this.hideTipe();
                this.getContentInsoRequest();
            },
            getContentInsoRequest(){
                if(this.courseTitleList.hasOwnProperty(this.selectContentId)) {
                    return
                }
                this.$store.dispatch('loading');
                http.Http.get(config.Config.mypackagesCommon + '/' + this.selectContentId, '', msg => {
                    this.$store.dispatch('removeLoading');
                    this.courseTitleList[msg.info.uuid] =  msg.info.name;
                    this.courseDescList[msg.info.uuid] = msg.info.intro;
                    this.selectContentItem.push(msg);
                }, err => {
                    this.$store.dispatch('removeLoading');
                    this.alertComponentActive('common-error-alert', err.responseJSON.message);
                });
            },
            deletContent(uuid){
                this.selectContentId = uuid;
                this.isTips = true;
                this.tipComponent = AlertTip;
            },
            confirmDelete(){
                this.hideTipe();
                delete this.courseDescList[this.selectContentId];
                delete this.courseTitleList[this.selectContentId];
                for(let i = 0, j = this.selectContentItem.length; i < j; i++) {
                    if(this.selectContentItem[i].info.uuid === this.selectContentId) {
                        this.selectContentItem.splice(i,1);
                        break;
                    }
                }
            },
            //预览图上传到七牛
            uploadCoverToQiNiu(){
                if(this.coverUuid != '') {
                    this.createCourseRequest();
                } else {
                    this.$store.dispatch('loading');
                    let fileType = this.selectedImageFile.type.split('/').pop() === 'png' ? 'png' : 'jpg';
                    http.Http.get(config.Config.getImageToken + fileType, '', msg => {
                        let params = new FormData();
                        params.append('file', this.selectedImageFile);
                        params.append('key', msg.key);
                        params.append('token', msg.token);
                        http.Http.postFile('//up.qbox.me', params, (data) => {
                            this.$store.dispatch('removeLoading');
                            this.coverUuid = data.uuid;
                            this.createCourseRequest();
                        }, () => {
                            this.$store.dispatch('removeLoading');
                            this.errorAlert('网络错误，请重试')
                        })
                    }, () => {
                        this.$store.dispatch('removeLoading');
                        this.errorAlert('网络错误，请重试')
                    });
                }

            },
            createCourseRequest(){
                this.$store.dispatch('loading');
                let params = {
                    name: this.courseName,
                    categoryId: parseInt(this.selectTypeId),
                    coverUuid: this.coverUuid,
                    intro: this.descInfoHtml,
                    packages: []
                };
                for(let i = 0, j = this.selectContentItem.length; i < j; i++) {
                    params.packages.push({
                        uuid: this.selectContentItem[i].info.uuid,
                        name: this.courseTitleList[this.selectContentItem[i].info.uuid],
                        intro: this.courseDescList[this.selectContentItem[i].info.uuid]
                    })
                }
                http.Http.putToBody(config.Config.getClassList + '/' + this.uuid, params, () => {
                    this.$store.dispatch('removeLoading');
                    this.alertComponentActive('common-success-alert', '保存成功');
                    setTimeout(()=>{
                        window.location.href = '/course'
                    }, 100);
                }, err => {
                    this.$store.dispatch('removeLoading');
                    this.errorAlert(err.responseJSON.message)
                });

            }
        }
    }
</script>

<style scoped>

</style>