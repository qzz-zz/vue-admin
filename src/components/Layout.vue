<template>
	<div>
		<el-container style="min-height: 100vh;">
		  <el-header style="padding: 0;">
			  <NavBar v-model="isCollapse" @change="isCollapse = !isCollapse"></NavBar>
		  </el-header>
		  <el-container>
			<!-- 菜单 -->
		    <!-- <el-aside> -->
				<LeftMenu :isCollapse="isCollapse" width="200px"></LeftMenu>
			<!-- </el-aside> -->
			<!-- 内容 -->
		    <el-main>
				<router-view></router-view>
			</el-main>
		  </el-container>
		</el-container>
	</div>
</template>

<script>
	import NavBar from '@/components/NavBar.vue';
	import LeftMenu from '@/components/LeftMenu.vue';
	
	export default{
		components:{
			NavBar,
			LeftMenu,
		},
		data(){
			return {
				isCollapse:false,
			}
		},
		// methods:{
		// 	handleChange(){
		// 		if(this.isCollapse == false){
		// 			this.isCollapse=true;
		// 		}else{
		// 			this.isCollapse=false;
		// 		}
		// 	}
		// }
	}
</script>

<style>
</style>
