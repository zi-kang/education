import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Course from './views/Course.vue'
import AddCourse from './views/AddCourse.vue'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Test from './views/Test.vue'
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
            path: '/home',
            name: 'home',
            component: Home
        },
        {
            path: '/about',
            name: 'about',
            component: About,
            children: [
                {
                    // 当 /user/:id/profile 匹配成功，
                    // UserProfile 会被渲染在 User 的 <router-view> 中
                    path: 'test',
                    name: 'test',
                    component: Test
                },
            ]
        },
        {
            path: '/home/test',
            name: 'test',
            component: Test
        },
        {
            path: '/*',
            name: 'NotFont',
            component: NotFont
        }
    ]
})
