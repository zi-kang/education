import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 引入 axios
import axios from 'axios'

const $ = window.$

import config from './config';

export default new Vuex.Store({
    state: {
        count: 20,
        titles: 'AR教育',
        userId: '',
        userName: '',
        userTel: '',
        userLogo: '/static/image/default_user.png',
        userToken: '',
        hasRight: false,
        categories: [],
        staticImage: [],
        colorImage: []
    },
    mutations: {
        increment (state) {
            state.count++
        },
        SET_USERID(state, ids){
          state.userId = ids
        },
        SET_NAME(state, username){
            state.userName = username;
        },
        SET_TITLE(state, title){
            state.titles = title;
        },
        SET_RIGHT(state, userRight) {
            state.hasRight = userRight;
        },
        SET_TPL(state, mobile) {
            state.userTel = mobile
        },
        SET_LOGO(state, userLogo) {
            state.userLogo = userLogo
        },
        SET_CATEGORIES(state, categories) {
            state.categories = categories;
        },
        SET_STATICIMAGE(state, staticImage) {
            state.staticImage = staticImage;
        },
        SET_COLORIMAGE(state, colorImage) {
            state.colorImage = colorImage;
        }
    },
    actions: {
        getStatus(context) {
            let that = this;
            $.ajax({
                url:"//passport.sightp.com/v4/token",
                type:"get",
                cache:false,
                dataType:"jsonp",
                jsonp:"callback", //这里定义了callback的参数名称，以便服务获取callback的函数名即getMessage
                jsonpCallback:"getMessage", //这里定义了jsonp的回调函数
                beforeSend: (xhr) => {
                    xhr.setRequestHeader("Authorization", localStorage['educationToken']);
                },
                success:function(msg){
                    that.dispatch('setName', msg.username);
                    context.commit('SET_USERID', msg.userId);
                    context.commit('SET_LOGO',  'http://sightpimage-cdn.sightp.com/avatar/' + msg.userId + '_middle.jpg');
                },
                error:function(){
                    // window.location.href = '/'
                }
            });
        },
        increment (context) {
            context.commit('increment')
        },
        setName (context, username) {
            context.commit('SET_NAME', username)
        },
        getRight(context) {
            axios.get('//edu-portal-api.sightp.com/passport/user',
                {
                    headers: {
                        'Authorization': localStorage['educationToken']
                    }
                }
            )
                .then(res => {
                    context.commit('SET_RIGHT', true)
                    context.commit('SET_TPL', res.data.mobile)
                    context.commit('SET_NAME', res.data.username)
                })
                .catch(() => {
                    // console.info(err)
                })
        },
        setTitle(context, title) {
            context.commit('SET_TITLE', title)
        },
        getCategories(context) {
            axios.get(config.Config.categories,
                {
                    headers: {
                        'Authorization': localStorage['educationToken']
                    }
                }
            )
                .then(res => {
                    context.commit('SET_CATEGORIES', res.data);
                    let msg = res.data;
                    let staticImage = [],
                        colorImage = [];
                    for (let i = 0, j = msg.length; i < j; i++) {
                        staticImage[msg[i].id] = '//staticfile-cdn.sightp.com/edu/category/' + msg[i].id + '.png';
                        colorImage[msg[i].id] = '//staticfile-cdn.sightp.com/edu/category/' + msg[i].id + '_a.png';
                    }
                    context.commit('SET_STATICIMAGE', staticImage);
                    context.commit('SET_COLORIMAGE', colorImage)
                })
                .catch(() => {
                    // console.info(err)
                })
        },
        clickStopPropagation(ev) {
            if (ev && ev.stopPropagation) {
                ev.stopPropagation();
            } else {
                window.event.cancelBubble = true;
            }
        }
    }
})
