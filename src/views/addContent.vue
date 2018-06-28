<template>
    <div id="addContentPage">
        <div  class="common-alert-block p-center">
            <AlertComponent v-for="item in alertComponentList" :className="item.className" :msg = "item.text"></AlertComponent>
        </div>
        <Nav></Nav>
        <!--全局搜索可以做一个组件的-->
        <div class="education-content-page-top common-page-top b-sizing t-left pr">
            <router-link to="/content"><i class="dlb vtm icon-back p-pointer"></i></router-link>
            <span class="dlb vtm class-name">添加AR内容</span>
        </div>
        <div class="add-content-main b-sizing">
            <div class="add-content-top-common dlb vtm mr20">
                <p class="add-content-title-common">AR内容名称</p>
                <input type="text" placeholder="请输入AR内容名称" class="active-btns b-sizing content-name-input add-common-style">
            </div>
            <div class="add-content-top-common dlb vtm">
                <p class="add-content-title-common">AR内容包</p>
                <div class="add-common-style content-name-input active-btns pr t-left ell">
                    <input type="file" class="pa add-common-style common-input-file p-pointer" style="left: 0;top: 0;z-index: 10;" title="请选择AR内容包" @change="fileChange">
                    <i v-if="!selectedContentFile" class="dlb vtm icon-add"></i>
                    <div v-if="selectedContentFile" class="content-file-name ell dlb vtm">{{contentFileName}}</div>
                    <span class="dlb vtm add-text">选择文件</span>
                </div>
            </div>
            <p class="add-content-title-common">预览图</p>
            <div class="add-cover-main">
                <div class="cover-image-pre dlb fl pr">
                    <img :src="coverImage" alt="" class="db v-center">
                </div>
                <div class="add-cover-btns active-btns fl p-pointer b-sizing t-left pr">
                    <i class="dlb vtm icon-add"></i>
                    <span class="dlb vtm add-text">选择文件</span>
                    <span class="add-text-desc db">.jpg或.png格式的图片， 建议分辨</span>
                    <input type="file" class="common-input-file cover-image-input pa p-pointer" accept=".jpg, .png" @change="coverFileChange">
                </div>
            </div>
            <img v-for="item in selectedImageCoveList" :src="item.fileUrl" alt="">
            <h1>已选择图片文件个数为：{{selectCount}}</h1>

        </div>
    </div>
</template>

<script>
    import config from '../config';
    import http from '../http';
    import Nav from '@/components/Nav.vue';
    import AlertComponent from '@/components/AlertComponent.vue';
    export default {
        name: "addContent",
        data(){
          return {
              addImageText: '选择文件',
              selectedContentFile: '',
              selectedImageCoveList: [],
              alertComponentList: [],
              contentFileName: '',
              coverImage: '/static/image/empty_cover.jpg'
          }
        },
        beforeCreate: function () {
            document.title = 'AR教育-添加AR内容';
            this.$store.dispatch('getStatus');
        },
        components: {
            Nav,
            AlertComponent
        },
        computed:{
          selectCount: function () {
              return this.selectedImageCoveList.length
          }
        },
        methods: {
            alertComponentActive(className, text){
                this.alertComponentList.push({className, text});
                setTimeout(()=>{
                    this.alertComponentList.shift();
                }, 3000);
            },
            fileChange: function (e) {
                if($(e.target).val() === '') return;
                this.selectedContentFile = e.target.files[0];
                $(e.target).val('');
                this.contentFileName = this.selectedContentFile.name;
            },
            coverFileChange: function (e) {
                if($(e.target).val() === '') return;
                let selcedFile = e.target.files[0];
                $(e.target).val('');
                let fileType = selcedFile.type.split('/').pop(),
                    fileSize = Math.ceil(selcedFile.size);
                let windowURL = window.URL || window.webkitURL;
                if((fileType === 'jpeg' || fileType === 'png') && fileSize < 2097152) {
                    selcedFile.fileUrl =  windowURL.createObjectURL(selcedFile);
                    this.selectedImageCoveList.push(selcedFile)
                } else if (fileType === 'jpeg' || fileType === 'png') {
                    this.alertComponentActive('common-error-alert', '请选择2M内的.jpg或者.png的图片文件')
                } else {
                    this.alertComponentActive('common-error-alert', '请选择.jpg或者.png的图片文件')
                }
            }
        }
    }
</script>

<style scoped>
    #addContentPage{
        width: 100%;
        min-height: 800px;
    }
    .icon-back{
        margin-right: 10px;
    }
    .mr20{
        margin-right: 20px;
    }
    .add-content-main{
        width: 780px;
        min-height: 600px;
        margin: 0 auto;
        padding-top: 10px;
    }
    .add-content-top-common{
        width: 380px;
    }
    .add-content-title-common{
        height:14px;
        margin: 20px 0 10px;
        line-height:14px;
        font-size:14px;
        color:rgba(51,51,51,1);
        text-align: left;
    }
    .add-common-style{
        width:380px;
        height:40px;
    }
    .content-name-input{
        padding: 0 10px;
        line-height: 40px;
        font-size: 14px;
        color: #333333;
    }
    .add-text{
        margin-left: 10px;
        color: #00A983;
    }
    .content-file-name{
        width: 210px;
        margin-right: 104px;
    }

    .add-cover-main{
        width: 380px;
        height: 124px;
    }
    .cover-image-pre {
        width: 220px;
        height: 124px;
        background-color: #EEEEEE;
    }

    .cover-image-pre img {
        max-width: 220px;
        max-height: 124px;
        border: 0 none;
    }

    .add-cover-btns {
        width: 160px;
        height: 124px;
        padding: 29px 10px;
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
    }

</style>