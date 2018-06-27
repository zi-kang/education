import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Course from './views/Course.vue'
import AddCourse from './views/AddCourse.vue'
import UserInfo from './views/UserInfo.vue'

import NotFont from './views/NotFont.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index,
            meta: {
                title: 'AR教育-登录'
            }
        },
        {
            path: '/course',
            name: 'course',
            component: Course,
            meta: {
                title: 'AR教育-课程'
            }
        },
        {
            path: '/course/addCourse',
            name: 'addCourse',
            component: AddCourse,
            meta: {
                title: 'AR教育-添加课程'
            }
        },
        {
            path: '/userInfo',
            name: 'userInfo',
            component: UserInfo,
            meta: {
                title: 'AR教育-个人中心'
            }
        },
        {
            path: '/*',
            name: 'NotFont',
            component: NotFont
        }
    ]
})
