import Vue from 'vue';
import Router from 'vue-router';

const _import = require('./_import_' + process.env.NODE_ENV);
import Full from '@/containers/Full'
import Full2 from '@/containers/Full2'

import Buttons from '@/views/components/Buttons'
import table from '@/views/table'
import Evaluate from '@/views/Evaluate'

// Views - Pages
import Page404 from '@/views/errorPages/Page404'
import Page500 from '@/views/errorPages/Page500'


/* login */
const Login = _import('login/index');
Vue.use(Router);

export const constantRouterMap = [
    {path: '/login', component: Login, hidden: true},
    {
        path: '/pages', redirect: '/pages/p404', name: 'Pages',
        component: {
            render(c) {
                return c('router-view')
            }
            // Full,
        },
        children: [{path: '404', name: 'Page404', component: _import('errorPages/Page404')},
            {path: '500', name: 'Page500', component: _import('errorPages/Page404')},
        ]
    }


]

export default new Router({
    mode: 'hash',
    linkActiveClass: 'open active',
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
});

export const asyncRouterMap = [

    {
        path: '/',
        redirect: '/table',//初始化时选中的左侧目录
        name: '首页',
        component: Full,
        hidden: false,
        children: [
            // {path: '/table', name: '表格综合实例', icon: 'ios-paper', component: _import('Table'), meta: {role: ['admin']}},

            {path: '/table', name: '直播间', icon: "social-html5", component: _import('table')},
            {path: '/liveBroadcast', name: '观看直播', icon: 'speedometer', component: _import('liveBroadcast')},
            // {
            //     path: '/Evaluate',
            //     name: '直播评议',
            //     icon: "thumbsup",
            //     component: _import('Evaluate'),
            //     meta: {role: ['editor']}
            // },
            // {
            //     path: '/Dashboard2',
            //     name: '会议评议结果',
            //     icon: "thumbsup",
            //     component: _import('Dashboard2'),
            //     meta: {role: ['editor']}
            // },
            // {path: '/addInfo', name: '信息管理', icon: 'ios-paper', component: _import('Manage'), meta: {role: ['admin']}},
            // {path: '/introduction', name: '介绍', icon: 'thumbsup', component: _import('Introduction')},
            {
                path: '/addInfo',
                name: '信息管理',
                redirect: '/addInfo/communityManage',
                meta: {role: ['admin']},
                icon: 'android-document',
                component: {
                    render(c) {
                        return c('router-view')
                    }
                },
                children: [{
                    path: 'communityManage',
                    name: '社区管理',
                    icon: 'bookmark',
                    component: _import('addInfo/communityManage'),
                    hidden: false,
                },
                    {
                        path: 'meetManage',
                        name: '会议管理',
                        icon: 'android-list',
                        component: _import('addInfo/meetManage')
                    },
                    {
                        path: 'userManage',
                        name: '用户管理',
                        icon: 'ios-analytics',
                        component: _import('addInfo/userManage')
                    },
                    {
                        path: 'voteDetail',
                        name: '评议管理',
                        icon: 'pie-graph',
                        component: _import('addInfo/voteDetail')
                    },

                    // {
                    //     path: 'Diagram',
                    //     name: '新增用户',
                    //     icon: 'ios-chatbubble-outline',
                    //     component: _import('addInfo/Diagram')
                    // }
                ]
            },
            // {
            //     path: '/components', name: 'component组件', redirect: '/components/buttons', icon: 'bookmark',
            //     component: {
            //         render(c) {
            //             return c('router-view')
            //         }
            //     },
            //     children: [{
            //         path: 'buttons',
            //         name: 'Buttons按钮',
            //         icon: 'social-youtube',
            //         component: _import('components/Buttons'),
            //         hidden: false,
            //     },
            //         {path: 'hoverbuttons', name: '悬停特效按钮', icon: 'wand', component: _import('components/HoverButtons')},
            //         {path: 'alert', name: 'Alert警告提示', icon: 'alert', component: _import('components/Alert')},
            //         {path: 'card', name: 'Card卡片', icon: 'ios-browsers-outline', component: _import('components/Card')},
            //         {
            //             path: 'datepicker',
            //             name: 'DatePicker',
            //             icon: 'ios-calendar-outline',
            //             component: _import('components/DatePicker')
            //         },
            //         {path: 'form', name: 'Form表单', icon: 'ios-list-outline', component: _import('components/Form')},
            //         {
            //             path: 'modal',
            //             name: 'Modal对话框',
            //             icon: 'ios-chatbubble-outline',
            //             component: _import('components/Modal')
            //         },
            //         {
            //             path: 'select',
            //             name: 'Select选择器',
            //             icon: 'ios-arrow-down',
            //             component: _import('components/Select')
            //         },
            //         {path: 'spin', name: 'Spin加载中', icon: 'load-d ', component: _import('components/Spin')},
            //         {
            //             path: 'steps',
            //             name: 'Steps步骤条',
            //             icon: 'ios-checkmark-outline',
            //             component: _import('components/Steps')
            //         },
            //         {
            //             path: 'timeline',
            //             name: 'Timeline时间轴',
            //             icon: 'android-more-vertical',
            //             component: _import('components/Timeline')
            //         },
            //         {
            //             path: 'transfer',
            //             name: 'Transfer穿梭框',
            //             icon: 'ios-pause-outline',
            //             component: _import('components/Transfer')
            //         },
            //         {
            //             path: 'timepicker',
            //             name: 'Timepicker',
            //             icon: 'ios-clock-outline',
            //             component: _import('components/Timepicker')
            //         },
            //         {
            //             path: 'upload',
            //             name: 'Upload上传',
            //             icon: 'ios-cloud-upload-outline',
            //             component: _import('components/Upload')
            //         },
            //     ]
            // },
            // {
            //     path: '/charts', name: 'echart图表', redirect: '/charts/shopchart', icon: 'pie-graph',
            //     component: {
            //         render(c) {
            //             return c('router-view')
            //         }
            //     },
            //     children: [{
            //         path: 'shopchart',
            //         name: '商场统计图表',
            //         icon: 'stats-bars',
            //         component: _import('charts/ShopChart'),
            //         hidden: false,
            //     },
            //         {
            //             path: 'radarchart',
            //             name: '雷达图',
            //             icon: 'arrow-graph-up-right',
            //             component: _import('charts/RadarChart')
            //         },
            //         {path: 'cakechart', name: '蛋糕销量图表', icon: 'ios-analytics', component: _import('charts/CakeChart')}
            //     ]
            // },
            // {path: '/jsontree', name: 'JSON视图', icon: 'merge', component: _import('JsonTree')},
            // {path: '/tabledetail/:id', name: 'TableDetail', hidden: true, component: _import('TableDetail')},
            // {path: '/tinymce', name: 'Tinymce编辑器', icon: "android-document", component: _import('Tinymce')},
            // {path: '/markdown', name: 'Markdown', icon: "android-list", component: _import('Markdown')},
        ]
    },

    {
        path: '/home1',
        redirect: '/home1/introduction',
        name: '首页2',
        component: Full2,
        hidden: false,
        children: [
            {path: '/home1/dashboard', name: 'Dashboard2', icon: 'speedometer', component: _import('Dashboard2')},
            {path: '/home1/introduction', name: '介绍2', icon: 'thumbsup', component: _import('Introduction')},

        ]
    },
    {path: '*', redirect: '/pages/404', hidden: true}
];


