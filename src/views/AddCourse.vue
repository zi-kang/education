<template>
    <div id="addCourseItemPage" class="pr common-page-style b-sizing" @click="globalClick">
        <div v-for="item in alertComponentList">
            <AlertComponent :className="item.className" :msg = "item.text"></AlertComponent>
        </div>
        <Nav></Nav>
        <div class="education-class-page-top common-page-top b-sizing t-left pr">
            <router-link to="/course"><i class="dlb vtm icon-back p-pointer back-to-course"></i></router-link>
            <span class="dlb vtm class-name">创建课程</span>
        </div>
        <div class="add-course-main clearfix">
            <div class="add-top-left fl t-left">
                <p class="add-title-text-common">课程名称</p>
                <input type="text" class="course-name-input active-btns b-sizing" maxlength="30" placeholder="请输入课程名称">
                <p class="add-title-text-common">课程分类</p>
                <div class="select-course-type active-btns pr" v-bind:class="{'o-dn': !clickShow}"
                     @click="selectTypeClick">
                    <span class="current-select active-btns p-pointer b-sizing">{{selectName}}</span>
                    <div class="categories-list pa">
                        <span v-for="item in categories" class="select-type-item-btn active-btns p-pointer b-sizing"
                              :data-id="item.id" @click="selectItem">{{item.name}}</span>
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
            <div class="active-btns select-content-block t-center p-pointer">
                <i class="dlb vtm icon-add"></i>
                <span class="dlb vtm">选择AR内容</span>
            </div>
            <span class="dlb common-confirm-create-btns t-center p-pointer" @click="createCourse">确认创建</span>
        </div>
    </div>
</template>

<script>
    import config from '../config';
    import http from '../http';
    import Nav from '@/components/Nav.vue';
    import Editor from '@/components/Editor.vue';
    import AlertComponent from '@/components/AlertComponent.vue';

    export default {
        name: "AddCourse",
        data() {
            return {
                clickShow: false,
                selectTypeId: '',
                selectName: '请选择课程分类',
                descInfoText: '',
                descInfoHtml: '',
                selectedImageFile: '',
                coverImage: '/static/image/empty_cover.jpg',
                alertComponentList: []
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
            AlertComponent
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
                this.selectName = $(ev.target).text()
                this.selectTypeId = $(ev.target).attr('data-id')
            },
            fileChange(e) {
                if($(e.target).val() === '') return;
                let fileUrl = $(e.target).val();
                this.selectedImageFile = e.target.files[0];
                console.log(this.selectedImageFile);
                $(e.target).val('');
                let fileType = this.selectedImageFile.name.split('.').pop(),
                    fileSize = this.selectedImageFile.size;
                let windowURL = window.URL || window.webkitURL;
                if (this.selectedImageFile && this.selectedImageFile.type.split('/')[0] === 'image') {
                    this.coverImage = windowURL.createObjectURL(this.selectedImageFile);
                } else if (this.selectedImageFile.type.split('/')[0] === 'image'){
                    this.coverImage = fileUrl;
                } else {
                    this.selectedImageFile = '';
                }
            },
            createCourse() {
                this.alertComponentActive('active', '测试')
            },
            alertComponentActive(className, text){
                this.alertComponentList.push({className, text});
                this.removeLastComponent();
            },
            removeLastComponent(){
                setTimeout(()=>{
                    this.alertComponentList.pop();
                }, 3000);
            }
        }
    }
</script>

<style scoped>
    #addCourseItemPage .education-class-page-top .class-name {
        margin-right: 10px;
        font-size: 36px;
        color: #494A4E;
    }

    #addCourseItemPage .education-class-page-top .back-to-course {
        margin-right: 10px;
    }

    #addCourseItemPage .add-course-main {
        width: 780px;
        margin: 0 auto;
    }

    #addCourseItemPage .add-title-text-common {
        margin: 20px 0 10px;
        line-height: 14px;
        font-size: 14px;
        color: #333333;
        text-align: left;
    }

    #addCourseItemPage .add-top-left,
    #addCourseItemPage .add-top-right {
        width: 380px;
        font-size: 0;
    }

    #addCourseItemPage .course-name-input,
    #addCourseItemPage .select-course-type span {
        display: block;
        width: 380px;
        height: 40px;
        padding: 0 10px;
        line-height: 40px;
        font-size: 14px;
    }

    #addCourseItemPage .select-course-type span {
        color: #CCCCCC;
    }

    #addCourseItemPage .categories-list {
        top: 40px;
        right: -20px;
        left: 0;
        max-height: 200px;
        overflow: auto;
        z-index: 10008;
    }

    #addCourseItemPage .add-cover-main {
        width: 100%;
        height: 124px;
    }

    #addCourseItemPage .cover-image-pre {
        width: 220px;
        height: 124px;
        background-color: #EEEEEE;
    }

    #addCourseItemPage .cover-image-pre img {
        max-width: 220px;
        max-height: 124px;
        border: 0 none;
    }

    #addCourseItemPage .add-cover-btns {
        width: 160px;
        height: 124px;
        padding: 29px 10px;
    }

    #addCourseItemPage .add-text {
        margin-left: 10px;
        font-size: 14px;
        color: #00A983;
    }

    .add-text-desc {
        margin-top: 10px;
        line-height: 18px;
        font-size: 12px;
        color: #999999;
    }

    .cover-image-input {
        width: 160px;
        height: 124px;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
    }

    #addCourseItemPage .select-content-block {
        width: 780px;
        height: 40px;
        line-height: 40px;
        font-size: 0;
    }

    #addCourseItemPage .select-content-block span {
        margin-left: 10px;
        font-size: 14px;
        color: #00A983;
    }
</style>