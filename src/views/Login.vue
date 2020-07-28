<template>
	<div class="bg">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>登录</span>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
				<el-form-item label="账户" prop="username">
					<el-input v-model="ruleForm.username" placeholder="请输入账户名!" prefix-icon="el-icon-user"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="ruleForm.password" placeholder="请输入密码!" prefix-icon="el-icon-key" show-password></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleLogin('ruleForm')">登录</el-button>
				</el-form-item>
			</el-form>
			<div class="footer">
				<div>
					<router-link to="/register">注册账户</router-link>
				</div>
				<div><a href="#">忘记密码？</a></div>
			</div>
		</el-card>
	</div>
</template>

<script>
	import {Admin} from '@/api/index';
	export default{
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.ruleForm.checkPass !== '') {
						this.$refs.ruleForm.validateField('checkPass');
					}
					callback();
				}
			};
			return {
				ruleForm: {
					// 这里的数据名称必须和后台数据库里的参数名称一样顺序一样
					username: '',
					password: '',
				},
				rules: {
					username: [{
							required: true,
							message: '请输入账户',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 5,
							message: '长度在 3 到 5 个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							validator: validatePass,
							trigger: 'blur'
						},
						{
							min: 3,
							message: '长度不能少于3位',
							trigger: 'blur'
						}
					],
				}
			};
		},
		methods:{
			//登录 提交表单
			handleLogin(formName){
				this.$refs[formName].validate(async (valid) => {
					if (!valid) {
						//校验失败
						return false;
					}
					//校验通过
					//封装API后
					let { status, msg, data } = await Admin.login({ ...this.ruleForm });
				
					if (status) {
						//登录成功 储存Token uid role
						sessionStorage.token=data.token;
						sessionStorage.uid=data.id;
						sessionStorage.role=data.role;
						
						//解构之后
						this.$message.success(msg);
						// 是否有redirect参数
						let {redirect} = this.$route.query;
						if(redirect){
							this.$router.replace(redirect);
						}else{
							//默认跳转路由	
							this.$router.replace('/goods/list');
						}
					} else {
						//失败
						this.$message.error(msg);
					}
				});
			}
		}
	}
</script>

<style scoped>
	.bg {
		height: 100vh;
		background: url(../assets/img/login-bg.jpg) top center no-repeat;
		background-size: cover;
	}
	
	.box-card {
		width: 350px;
		position: absolute;
		top: 50%;
		right: 40px;
		transform: translate(0, -50%);
	}
	
	.footer {
		display: flex;
		justify-content: space-between;
	}
	
	.footer a {
		color: #606266;
		text-decoration: none;
		font-size: 14px;
	}
	
	.footer a:hover {
		color: #409EFF;
	}
</style>
