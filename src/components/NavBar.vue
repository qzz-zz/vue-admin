<template>
	<div class="navbar">
		<div class="left">
			<div>
				<img src="@/assets/img/logo.png" alt="">
			</div>
			<div>
				<i @click="handleClick" class="el-icon-s-fold"></i>
			</div>
		</div>
		<!-- 下拉菜单 -->
		<div class="right">
			<el-menu class="el-menu-demo" mode="horizontal" background-color="#31404e" text-color="#fff">
				<el-submenu index="2" class="dropdown">
					<template slot="title">
						<span class="el-dropdown-link" v-model="person">
							<el-avatar :src="person.avatar" :size='30' class="img"></el-avatar>
							{{person.username}}
						</span>
					</template>
					<el-menu-item index="2-1">消息</el-menu-item>
					<el-menu-item index="2-2">设置</el-menu-item>
					<el-menu-item index="2-3">退出</el-menu-item>
				</el-submenu>
			</el-menu>
		</div>
	</div>
</template>

<script>
	import { Admin } from '@/api/index';
	export default {
		data() {
			return {
				person: [],
			}
		},
		created() {
			//获取数据
			this.loadinfo();
		},
		methods: {
			handleClick() {
				this.$emit('change');
			},
			async loadinfo() {
				var id = sessionStorage.uid;
				let { status, data } = await Admin.info({ id });
				if (status) {
					this.person = data;
				}
			},
		}
	}
</script>

<style scoped>
	.navbar {
		background-color: #31404e;
		color: #fff;
		height: 60px;
		line-height: 60px;
		display: flex;
		justify-content: space-between;
	}

	.navbar .left {
		display: flex;
	}

	.navbar .left img {
		height: 60px;
		margin-left: 20px;
	}

	.navbar .right {
		padding-right: 40px;
		color: #fff;
	}

	.navbar .right img {
		height: 30px;
		width: 30px;
		margin-right: 10px;
		border-radius: 50%;
	}
</style>
