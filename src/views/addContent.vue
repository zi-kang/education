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
                <input type="text" v-model="contentName" placeholder="请输入AR内容名称" class="active-btns b-sizing content-name-input add-common-style">
            </div>
            <div class="add-content-top-common dlb vtm">
                <p class="add-content-title-common">AR内容包</p>
                <div class="add-common-style content-name-input b-sizing active-btns pr t-left ell">
                    <input type="file" class="pa add-common-style common-input-file p-pointer" style="left: 0;top: 0;z-index: 10;" accept=".ezp" title="请选择AR内容包" @change="fileChange">
                    <i v-if="!selectedContentFile" class="dlb vtm icon-add"></i>
                    <div v-if="selectedContentFile" class="content-file-name ell dlb vtm">{{contentFileName}}</div>
                    <span class="dlb vtm add-text">选择文件</span>
                </div>
            </div>
            <p class="add-content-title-common">预览图</p>
            <div class="pre-image-main clearfix">
                <div v-for="item in selectedImageCoveList" class="add-cover-main fl b-sizing" v-bind:class="{errorItem:item.isError}">
                    <div class="cover-image-pre dlb fl pr">
                        <img :src="item.fileUrl" alt="" class="db v-center">
                    </div>
                    <div class="add-cover-btns active-btns fl b-sizing t-left pr">
                        <i v-show="item.isCover" class="dlb vtm icon-yes"></i>
                        <i class="dib pa icon-delete p-pointer" @click="deletCover(item.fileUrl)"></i>
                        <span v-show="!item.isCover" class="dlb vtm add-text p-pointer" @click="changeCover(item.fileUrl)">设为封面</span>
                        <span v-show="item.isCover" class="dlb vtm add-text-static">封面</span>
                    </div>
                </div>
                <div v-if="selectedImageCoveList.length != 6" class="add-cover-main fl">
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
            </div>
            <p class="add-content-title-common">描述</p>
            <textarea  v-model="descInfoText" class="db b-sizing eidtor-block active-btns" maxlength="500" placeholder="请输入内容描述" />
            <a href="javascript: void (0)" class="dlb common-confirm-create-btns t-center p-pointer" @click="createContent">确认创建</a>
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
              contentName: '',
              selectedContentFile: '',
              selectedImageCoveList: [],
              alertComponentList: [],
              contentFileName: '',
              coverImage: '/static/image/empty_cover.jpg',
              descInfoText: '',
              contentFileToken: {},
              contentQiNiuInfo: {},
              imageFileToken: [],
              imageCoverUUid: '',
              contentGetRight: true,
              shouldGetContent: true,
              coverImageGetRight: true,
              uploadRequestNum: 0
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
            errorAlert(errMsg) {
              this.alertComponentActive('common-error-alert', errMsg)
            },
            fileChange: function (e) {
                if($(e.target).val() === '') return;
                let selectedFile = e.target.files[0];
                $(e.target).val('');
                if(selectedFile.name.split('.').pop() != 'ezp') {
                    this.errorAlert('请选择ezp格式的文件');
                } else if (Math.ceil(selectedFile.size) > 52428800) {
                    this.errorAlert('文件大小不允许超过50m');
                } else {
                    this.selectedContentFile = selectedFile;
                    this.contentFileName = selectedFile.name;
                }
            },
            coverFileChange: function (e) {
                if($(e.target).val() === '') return;
                let selcedFile = e.target.files[0];
                $(e.target).val('');
                if(this.selectedImageCoveList.length === 6) {
                    this.alertComponentActive('common-alert-alert', '最多上传6张预览图');
                    return;
                }
                let fileType = selcedFile.type.split('/').pop(),
                    fileSize = Math.ceil(selcedFile.size);
                let windowURL = window.URL || window.webkitURL;
                if((fileType === 'jpeg' || fileType === 'png') && fileSize < 2097152) {
                    let midifyFileItem = {
                        files: selcedFile,
                        fileUrl: windowURL.createObjectURL(selcedFile),
                        isCover: false,
                        isError: true,
                        fileType: fileType,
                        uploadToken: '',
                        uploadKey: '',
                        assetUrl: '',
                        uuid: ''
                    };
                    if(this.selectedImageCoveList.length === 0) {
                        midifyFileItem.isCover = true;
                    }
                    this.selectedImageCoveList.push(midifyFileItem)
                } else if (fileType === 'jpeg' || fileType === 'png') {
                    this.alertComponentActive('common-error-alert', '请选择2M内的.jpg或者.png的图片文件')
                } else {
                    this.alertComponentActive('common-error-alert', '请选择.jpg或者.png的图片文件')
                }
            },
            changeCover: function(fileUrl) {
                for(let i = 0, j = this.selectedImageCoveList.length; i < j; i++) {
                    if(this.selectedImageCoveList[i].fileUrl === fileUrl) {
                        this.selectedImageCoveList[i].isCover = true;
                    } else {
                        this.selectedImageCoveList[i].isCover = false;
                    }
                }
            },
            deletCover: function(fileUrl){
                for(let i = 0, j = this.selectedImageCoveList.length; i < j; i++) {
                    if(this.selectedImageCoveList[i].fileUrl === fileUrl) {
                        let isCoverActive = this.selectedImageCoveList[i].isCover;
                        this.selectedImageCoveList.splice(i,1);
                        if(isCoverActive && this.selectedImageCoveList.length > 0) {
                            this.selectedImageCoveList[0].isCover = true;
                        }
                        break;
                    }
                }
            },
            createContent: function () {
                if(this.contentName.length === 0) {
                    this.errorAlert( '请输入AR内容名称')
                } else if(!this.selectedContentFile) {
                    this.errorAlert( '请上传AR内容包')
                } else if (this.selectedImageCoveList.length === 0){
                    this.errorAlert( '请上传预览图')
                } else if (!this.descInfoText) {
                    this.errorAlert( '请输入课程描述')
                } else if (this.descInfoText.length > 500) {
                    this.errorAlert( '课程描述字数不能超过500')
                } else {
                    this.uploadRequestNum = 0;
                    if(!this.shouldGetContent) {
                        this.uploadRequestNum++;
                    }
                    for(let i = 0, j = this.selectedImageCoveList.length; i < j; i++) {
                        if(!this.selectedImageCoveList[i].isError) {
                            this.uploadRequestNum++;
                        }
                    }
                    this.$store.dispatch('loading');
                    this.getEzpUploadToken();
                    this.getImageUploadToken();
                }
            },
            getEzpUploadToken(){
                http.Http.get(config.Config.getPackageToken + 'ezp', '', msg => {
                    this.contentFileToken = msg;
                    this.contentGetRight = true;
                    this.uploadContentToQiNiu();
                }, err => {
                    this.shouldGetContent = true;
                    this.contentGetRight = false;
                    this.afterRequestCommon();
                });
            },
            getImageUploadToken() {
                for(let i = 0, j = this.selectedImageCoveList.length; i < j; i++) {
                    if(this.selectedImageCoveList[i].isError) {
                        let fileType = this.selectedImageCoveList[i].fileType === 'png' ? 'png' : 'jpg';
                        http.Http.get(config.Config.getImageToken + fileType, '', msg => {
                            this.selectedImageCoveList[i].uploadToken = msg.token;
                            this.selectedImageCoveList[i].uploadKey = msg.key;
                            this.selectedImageCoveList[i].isError = false;

                            this.uploadCoverToQiNiu(this.selectedImageCoveList[i], i);
                        }, err => {
                            this.selectedImageCoveList[i].isError = true;
                            this.afterRequestCommon();
                        });
                    }
                }
            },
            uploadContentToQiNiu(){
                if(!this.coverImageGetRight) return;
                let params = new FormData();
                params.append('file', this.selectedContentFile);
                params.append('key', this.contentFileToken.key);
                params.append('token', this.contentFileToken.token);
                http.Http.postFile('//up.qbox.me', params, (msg) => {
                    this.shouldGetContent = false;
                    this.contentGetRight = true;
                    this.contentQiNiuInfo = msg;
                    console.log(this.contentQiNiuInfo);
                    this.afterRequestCommon();
                }, (jqXHR) => {
                    this.shouldGetContent = true;
                    this.contentGetRight = false;
                    this.afterRequestCommon();
                })
            },
            uploadCoverToQiNiu(coverInfo, i){
                if(!this.coverImageGetRight) return;
                let params = new FormData();
                params.append('file', coverInfo.files);
                params.append('key', coverInfo.uploadKey);
                params.append('token', coverInfo.uploadToken);
                http.Http.postFile('//up.qbox.me', params, (msg) => {
                    this.selectedImageCoveList[i].isError = false;
                    this.selectedImageCoveList[i].assetUrl = msg.assetUrl;
                    this.selectedImageCoveList[i].uuid = msg.uuid;
                    this.afterRequestCommon();
                }, (jqXHR) => {
                    this.selectedImageCoveList[i].isError = true;
                    this.afterRequestCommon();
                })
            },
            afterRequestCommon(){
                this.uploadRequestNum++;
                if (this.uploadRequestNum != this.selectedImageCoveList.length + 1) {
                    return;
                }
                this.$store.dispatch('removeLoading');
                if(this.contentGetRight && this.isAllCoverRight()) {
                    alert('可以向后端发起请求啦');
                    this.creatContentRequert();
                } else {
                    alert('请求失败啦')
                }

            },
            isAllCoverRight: function () {
                let charge = true;
                for(let i = 0, j = this.selectedImageCoveList.length; i < j; i++) {
                    if(this.selectedImageCoveList[i].isError) {
                        charge = false;
                        break;
                    }
                }
                return charge;
            },
            creatContentRequert(){
                this.$store.dispatch('loading');
                let params = {
                    name: this.contentName,
                    coverId: '',
                    intro: this.descInfoText,
                    WorkUuid: this.contentQiNiuInfo.uuid,
                    photos: []
                };
                for(let i = 0, j = this.selectedImageCoveList.length; i < j; i++) {
                    params.photos.push(this.selectedImageCoveList[i].uuid);
                    if(this.selectedImageCoveList[i].isCover) {
                        params.coverId =  this.selectedImageCoveList[i].uuid;
                    }
                }
                http.Http.postToBody(config.Config.mypackagesCommon, JSON.stringify(params), msg => {
                    this.$store.dispatch('removeLoading');
                    this.alertComponentActive('common-success-alert', '保存成功');
                    console.log(msg);
                }, err => {
                    this.$store.dispatch('removeLoading');
                    this.errorAlert(err.responseJSON.message)
                });

            }

        }
    }
</script>

<style scoped lang="less">
    #addContentPage{
        width: 100%;
        min-height: 800px;
        .icon-back{
            margin-right: 10px;
        }
        .icon-delete{
            top: 10px;
            right: 10px;
        }
        .errorItem{
            box-shadow:0 2px 10px 0 rgba(255,0,0,1);
            /*border: 1px solid #f00;*/
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
        .add-text-static{
            font-size: 14px;
            color: #333333;
            margin-left: 10px;
        }
        .content-file-name{
            width: 210px;
            margin-right: 84px;
        }

        .eidtor-block{
            width: 780px;
            height: 200px;
            padding: 15px;
            resize: none;

        }

        .add-cover-main{
            width: 380px;
            height: 124px;
        }
        .cover-image-pre {
            width: 220px;
            height: 124px;
            background-color: #EEEEEE;
            img {
                max-width: 220px;
                max-height: 124px;
                border: 0 none;
            }
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

        .pre-image-main{
            width: 100%;
            .add-cover-main:nth-child(2n + 1){
                margin-right: 20px;
            }
            .add-cover-main:nth-child(n + 3){
                margin-top: 20px;
            }
        }
    }


</style>