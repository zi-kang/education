<template>
    <div id="coursePage" class="pr">
        <Nav></Nav>
        <div class="education-class-page-top common-page-top b-sizing t-left pr">
            <span class="dlb vtm class-name">课程</span>
            <router-link to="/course/addCourse"><i class="dlb vtm icon-create p-pointer add-class-btn"></i></router-link>
            <div class="p-middle class-search-block page-search-common">
                <i class="dlb vtm icon-search"></i>
                <input type="text" class="class-name-search-input vtm t-left" placeholder="搜索课程名称" v-model="searchName"
                       maxlength="30" @keyup.13='getCourse'>
                <i v-if="searchName.length > 0" class="dlb vtm icon-search_delete p-pointer delete-search-name-btn"
                   @click="deleteSearchName"></i>
            </div>
        </div>
        <div class="class-type-nav pa-l t-left">
            <a href="javascript: void (0)" class="db b-sizing select-class-type-btn" v-bind:class="{ active: activeType == '-1' }" @click="changeType(-1)">全部课程</a>
            <a v-for="item in categories" href="javascript: void (0)" class="db ell b-sizing select-class-type-btn" v-bind:class="{ active: activeType == item.id }" @click="changeType(item.id)">
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
            <div v-for="item in courseRows" class="course-list-item active-btns fl b-sizing clearfix t-left active-btns pr">
                <h4 class="ell">测出是名称</h4>
                <i class="code-common-code dlb pa icon-code p-pointer get-course-class-number-btn"></i>
                <i class="dlb pa vtm icon-menu icon-menu-style"></i>
                <span class="course-type dlb vtm">课程种类</span>
                <div class="pre-image pr">
                    <!--<img src="{{item.image}}" alt="" class="db v-center">-->
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import config from '../config';
    import http from '../http';
    import Nav from '@/components/Nav.vue';

    export default {
        name: "course",
        data: function () {
            return {
                courseCount: 0,
                courseRows: [],
                activeType: '-1',
                searchName: '',
                searchActive: false
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
                size: 20
            }, msg => {
                self.courseCount = msg.count;
                self.courseRows = msg.rows;
            }, error => {
                console.log(error);
            });
        },
        components: {
            Nav
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
            getCourse: function () {
                let params = {
                    page: 1,
                    size: 2
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
                }, error => {
                    console.log(error);
                });
            },
            changeType: function (typeId) {
                this.activeType = typeId;
                this.getCourse();
            },
            deleteSearchName: function () {
                this.searchName = '';
                this.getCourse();
            }
        }
    }
</script>

<style scoped lang="less">
    #coursePage{
        height: 100%;
        min-height: 740px;

        .class-name {
            margin-right: 10px;
            font-size: 36px;
            color: #494A4E;
        }

        .back-to-course {
            margin-right: 10px;
        }

        .class-type-nav {
            top: 141px;
            bottom: 0;
            width: 220px;
            background-color: #fff;
            z-index: 10;
        }

        .select-class-type-btn {
            height: 30px;
            margin-top: 25px;
            line-height: 30px;
            padding-left: 20px;
            font-size: 14px;
            color: #666666;
            border-right: 5px solid #ffffff;

            span {
                max-width: 140px;
                color: #666666;
            }

            img {
                width: 30px;
                height: 30px;
                border: 0 none;
                margin-right: 10px;
            }

            .img-static {
                display: inline-block;
            }

            .img-active {
                display: none;
            }
        }
        .select-class-type-btn:hover,
        .select-class-type-btn.active {
            color: #34C2B0;
            border-right: 5px solid #34C2B0;
            span {
                color: #34C2B0;
            }
            .img-static {
                display: none;
            }
            .img-active {
                display: inline-block;
            }
        }


        .class-page-right{
            width: 100%;
            min-height: 600px;
            padding-left: 220px;
        }
        .class-list-block{
            width: 1380px;
            height: 680px;
            margin: 0 auto;
            font-size: 0;
        }
        .course-list-item {
            width: 210px;
            height: 170px;
            margin: 20px 0 0 20px;
            padding: 10px;
            font-size: 0;
            h4 {
                max-width: 150px;
                margin-bottom: 5px;
                line-height: 14px;
                font-size: 14px;
                color: #333333;
            }
            p {
                height: 15px;
            }
            .icon-menu-style {
                top: 21px;
                left: 3px;
                transform: scale(0.4, 0.4);
                -ms-transform: scale(0.4, 0.4); /* IE 9 */
                -moz-transform: scale(0.4, 0.4); /* Firefox */
                -webkit-transform: scale(0.4, 0.4); /* Safari 和 Chrome */
                -o-transform: scale(0.4, 0.4);
            }
        }



        .course-type {
            height: 12px;
            margin-left: 20px;
            line-height: 12px;
            font-size: 12px;
            color: #999999;
        }

        .code-common-code {
            top: 10px;
            right: 10px;
        }

        .pre-image {
            width: 190px;
            height: 110px;
            margin: 10px auto 0;
            background-color: #EEEEEE;
            border-radius: 5px;
            overflow: hidden;
            img {
                border: 0 none;
                max-width: 190px;
                max-height: 110px;
            }
        }
    }


</style>