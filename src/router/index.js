// import router from 'vue-router'
import { createRouter, createWebHistory} from "vue-router";

// 路由配置
const routes = [
    {
        path: '/',
        component:() => import ('../views/layout/layout.vue'), // 如果不是/login路径，则加载layout组件
        redirect: '/home', // 如果访问路径只有一个/，则重定向到/home，默认打开home页面
        children:[
            {
                path: '/home',
                name: 'home',
                component: () => import('../views/home/homepage.vue') //home页面
            },
            {
                path:'/clazz',
                name: 'clazz',
                component: () => import('../views/manage/clazz/clazz.vue') // 班级页面
            },
            {
                path:'/student',
                name: 'student',
                component: () => import('../views/manage/student/student.vue') // 学生页面
            },
            {
                path:'/subject',
                name: 'subject',
                component: () => import('../views/manage/subject/subject.vue') // 课程页面
            },
            {
                path:'/department',
                name: 'department',
                component: () => import('../views/system/department/department.vue') // 部门页面
            },
            {
                path:'/employee',
                name: 'employee',
                component: () => import('../views/system/employee/employee.vue') // 员工页面
            },
            {
                path:'/position',
                name: 'position',
                component: () => import('../views/system/position/position.vue') // 职位页面
            },
            {
                path:'/employeeAnalysis',
                name: 'employeeAnalysis',
                component: () => import('../views/analysis/employeeAnalysis/employeeAnalysis.vue') // 员工分析页面
            },
            {
                path:'/studentAnalysis',
                name: 'studentAnalysis',
                component: () => import('../views/analysis/studentAnalysis/studentAnalysis.vue') // 学生分析页面
            },
            {
                path:'/logAnalysis',
                name: 'logAnalysis',
                component: () => import('../views/analysis/logAnalysis/logAnalysis.vue') // 日志分析页面
            }
        ]
    },
    {
        path:'/login',
        name: 'login',
        component: () => import('../views/login/login.vue') // 登录页面
    }
];
// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
});
// 导出路由实例
export default router;