import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui';

Vue.use(VueRouter)

// 页面级组件
import Layout from '@/components/Layout.vue'

const routes = [{
		path: '/login',
		alias: '/',
		name: 'Login',
		component: () => import('@/views/Login.vue'),
		meta:{requiresAuth: false},
	},
	{
		path: '/register',
		name: 'Register',
		component: () => import('@/views/Register.vue'),
		meta:{requiresAuth: false},
	},
	// 权限
	{
		path:'/auth/',
		name:'Auth',
		component:Layout,
		meta:{requiresAuth: true},
		children:[{
			path: 'role',
			name:'AuthRole',
			component:() => import('@/views/Auth/Role.vue'),
		},
		{
			path: 'menu',
			name:'AuthMenu',
			component:() => import('@/views/Auth/Menu.vue'),
		}]
	},
	// 商品
	{
		path:'/goods/',
		name:'Goods',
		component:Layout,
		meta:{requiresAuth: true},
		children:[{
			path: 'category',
			name:'GoodsCategory',
			component:() => import('@/views/Goods/Category.vue'),
		},
		{
			path: 'list',
			name:'GoodsList',
			component:() => import('@/views/Goods/List.vue'),
		},
		{
			path: 'edit/:id',
			name:'GoodsEdit',
			component:() => import('@/views/Goods/Edit.vue'),
			props: true,//解耦
		},
		{
			path: 'release',
			name:'GoodsRelease',
			component:() => import('@/views/Goods/Release.vue'),
		}]
	},
	// 订单
	{
		path:'/order/',
		name:'Order',
		component:Layout,
		meta:{requiresAuth: true},
		children:[{
			path: 'list',
			name:'OrderList',
			component:() => import('@/views/Order/List.vue'),
		}]
	},
	// 用户
	{
		path:'/user/',
		name:'User',
		component:Layout,
		meta:{requiresAuth: true},
		children:[{
			path: 'list',
			name:'UserList',
			component:() => import('@/views/User/List.vue'),
		},
		{
			path: 'info',
			name:'UserInfo',
			component:() => import('@/views/User/Info.vue'),
			props: true,//解耦
		}]
	},
]

const router = new VueRouter({
	routes
})

//全局守卫
router.beforeEach((to, from, next) => {
	//登陆注册不进行校验，直接放行
	
	//根据meta元信息校验路由是否登录需要授权
	let isRequiresAuth = to.matched.some((path) => path.meta.requiresAuth);
	// 不需要校验
	if(!isRequiresAuth){
		next();
		return;
	}
	//校验token
	let token =sessionStorage.token;
	// 有token情况,立即放行
	if(token){
		next();
		return;
	}
	//无token情况，强制跳转登录
	Message.error('无效的info，请重新登录！');
	setTimeout(() => {
		next(`/login?redirect=${to.path}`);
	},2000);
	
});

export default router
