<template>
    <div id="addCourseItemPage" class="pr common-page-style b-sizing" @click="globalClick">
        <div  class="common-alert-block p-center">
            <AlertComponent v-for="item in alertComponentList" :className="item.className" :msg = "item.text"></AlertComponent>
        </div>
        <Nav></Nav>
        <div class="education-class-page-top common-page-top b-sizing t-left pr">
            <router-link to="/course"><i class="dlb vtm icon-back p-pointer back-to-course"></i></router-link>
            <span class="dlb vtm class-name">创建课程</span>
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
            <Editor v-on:listenChangeEvent="changeEditor"></Editor>
            <p class="add-title-text-common">课程内容</p>
            <div class="select-content-show pr active-btns clearfix b-sizing" v-for="item in selectContentItem">
                <i class="dlb pa icon-delete p-pointer" @click="deletContent"></i>
                <div class="content-show-left fl">
                    <div class="content-show-cover pr">
                        <img :src="item.info.preview" alt="" class="v-center">
                    </div>
                    <span class="dlb t-left">{{item.info.name}}</span>
                </div>
                <div class="content-show-right fr">
                    <p class="add-title-text-common right-title">标题</p>
                    <input type="text" maxlength="30" class="b-sizing" v-model="courseTitle" placeholder="请输入标题">
                    <p class="add-title-text-common">描述</p>
                    <textarea  v-model="courseDesc" class="db b-sizing" maxlength="500" placeholder="请输入内容描述" />
                </div>
            </div>
            <div class="active-btns select-content-block t-center p-pointer" @click="selectContent">
                <i class="dlb vtm icon-add"></i>
                <span class="dlb vtm">选择AR内容</span>
            </div>
            <a href="javascript: void (0)" class="dlb common-confirm-create-btns t-center p-pointer" @click="createCourse">确认创建</a>
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
    export default {
        name: "AddCourse",
        data() {
            return {
                clickShow: false,
                courseName: '',
                selectTypeId: '',
                selectName: '请选择课程分类',
                descInfoText: '',
                descInfoHtml: '',
                selectedImageFile: '',
                coverImage: '/static/image/empty_cover.jpg',
                alertComponentList: [],
                isTips: false,
                tipComponent: null,
                selectContentId: '',
                selectContentItem: [],
                courseTitle: '',
                courseDesc: ''
            }
        },
        beforeCreate: function () {
            document.title = 'AR教育-课程';
            this.$store.dispatch('getStatus');
            this.$store.dispatch('getCategories');
        },
        components: {
            Nav,
            Editor,
            AlertComponent,
            ContentList,
            AlertTip
        },
        computed: {
            categories: function () {
                return this.$store.state.categories
            }
        },
        methods: {
            changeEditor(msg) {
                this.descInfoText = msg.text
                this.descInfoHtml = msg.html
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
                    this.selectedImageFile = selectFile;
                    this.coverImage = windowURL.createObjectURL(this.selectedImageFile);
                }
            },
            createCourse() {
                if(this.courseName.trim() === '') {
                    this.errorAlert('请输入课程名称')
                } else if (this.selectTypeId === '') {
                    this.errorAlert('请选择课程分类')
                } else if (this.selectedImageFile === '') {
                    this.errorAlert('请选择封面')
                } else if (this.descInfoText.length === 0) {
                    this.errorAlert('请输入课程描述')
                } else if (this.descInfoText.length > 500) {
                    this.errorAlert('课程描述不能大于500个字符')
                } else if (this.selectContentId === '') {
                    this.errorAlert('请选择AR内容')
                } else if (this.courseTitle === '') {
                    this.errorAlert('请输入课程内容标题')
                } else if (this.courseDesc === '') {
                    this.errorAlert('请输入课程内容描述')
                } else {
                    this.uploadCoverToQiNiu();
                }
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
                this.$store.dispatch('loading');
                http.Http.get(config.Config.mypackagesCommon + '/' + this.selectContentId, '', msg => {
                    this.$store.dispatch('removeLoading');
                    this.selectContentItem = [];
                    this.courseTitle = msg.info.name;
                    this.courseDesc = msg.info.intro;
                    this.selectContentItem.push(msg);
                }, err => {
                    this.$store.dispatch('removeLoading');
                    this.alertComponentActive('common-error-alert', err.responseJSON.message);
                });
            },
            deletContent(){
                this.isTips = true;
                this.tipComponent = AlertTip;
            },
            confirmDelete(){
                this.hideTipe();
                this.selectContentItem = [];
                this.selectContentId = '';
                this.courseTitle = '';
                this.courseDesc = '';
            },
            //预览图上传到七牛
            uploadCoverToQiNiu(){
                this.$store.dispatch('loading');
                let fileType = this.selectedImageFile.type.split('/').pop() === 'png' ? 'png' : 'jpg';
                http.Http.get(config.Config.getImageToken + fileType, '', msg => {
                    let params = new FormData();
                    params.append('file', this.selectedImageFile);
                    params.append('key', msg.key);
                    params.append('token', msg.token);
                    http.Http.postFile('//up.qbox.me', params, (data) => {
                        this.$store.dispatch('removeLoading');
                        this.createCourseRequest(data);
                    }, (err) => {
                        this.$store.dispatch('removeLoading');
                        this.errorAlert('网络错误，请重试')
                    })
                }, err => {
                    this.$store.dispatch('removeLoading');
                    this.errorAlert('网络错误，请重试')
                });
            },
            createCourseRequest(data){
                console.log(data);
                this.$store.dispatch('loading');
                let params = {
                    name: this.courseName,
                    categoryId: parseInt(this.selectTypeId),
                    coverUuid: data.uuid,
                    intro: this.descInfoHtml,
                    packages: [{
                        uuid: this.selectContentId,
                        name: this.courseTitle,
                        intro: this.courseDesc
                    }]
                }
                http.Http.postToBody(config.Config.getClassList, params, msg => {
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
