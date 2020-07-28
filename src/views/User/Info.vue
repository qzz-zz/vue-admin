<template>
	<el-card class="box-card">
		<div slot="header">
			<span>账户信息</span>
		</div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="账户" prop="username">
				<el-input v-model="ruleForm.username" size="small" :disabled="true"></el-input>
			</el-form-item>
			<el-form-item label="姓名" prop="fullname">
				<el-input v-model="ruleForm.fullname" size="small"></el-input>
			</el-form-item>
			<el-form-item label="性别" prop="sex">
				<el-radio-group v-model="ruleForm.sex">
					<el-radio label="男"></el-radio>
					<el-radio label="女"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="手机" prop="tel">
				<el-input v-model.number="ruleForm.tel" size="small"></el-input>
			</el-form-item>
			<el-form-item label="权限" prop="role">
				<el-select v-model="ruleForm.role">
					<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="头像" prop="avatar">
				<!-- 上传成功事件 --><!-- 删除头像事件 -->
				<single-upload type="/api/upload/avatar" :url="ruleForm.avatar"  @success="handleUploadSuccess" @remove="ruleForm.avatar='' "></single-upload>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="saveAdmin('ruleForm')" size="medium">修改</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	import { Admin, Role } from '@/api/index';
	import SingleUpload from '@/components/SingleUpload.vue';

	export default {
		props: ['id'],
		components: {
			SingleUpload
		},
		data() {
			// 手机号验证
			var checkPhone = (rule, value, callback) => {
				const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/
				if (!value) {
					return callback(new Error('手机号码不能为空'))
				}
				setTimeout(() => {
					if (!Number.isInteger(+value)) {
						callback(new Error('请输入数字值'))
					} else {
						if (phoneReg.test(value)) {
							callback()
						} else {
							callback(new Error('手机号码格式不正确'))
						}
					}
				}, 100)
			};
			return {
				ruleForm: {
					username: '',
					fullname: '',
					sex: '',
					tel: '',
					role:'',
					avatar: '',
				},
				options:[],
				rules: {
					fullname: [{
							required: true,
							message: '请输入姓名',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 7,
							message: '长度在 1 到 7 个字符',
							trigger: 'blur'
						}
					],
					sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					}],
					tel: [{
						required: true,
						validator: checkPhone,
						trigger: 'blur'
					}],
					avatar: [{
						required: true,
						message: '请上传头像',
						trigger: 'blur'
					}],
					role: [{
						required: true,
						message: '请选择权限',
						trigger: 'blur'
					}],
				}
			};
		},
		created() {
			this.loadInfo(this.id);
		},
		methods: {
			//获取管理员个人资料
			async loadInfo(id) {
				var id=sessionStorage.uid;
				let { status, data } = await Admin.info({ id:id });
				if (status) {
					//数据在表单中显示出来
					this.ruleForm = data;
				}
				// 加载角色分类
				let role = await Role.list();
				if (role.status) {
					this.options=role.data;
				}
			},
			
			//保存修改
			saveAdmin(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (!valid) {
						//校验失败
						return false;
					}
					//校验成功
					let { status, msg } = await Admin.edit({ ...this.ruleForm });
					if (status) {
						this.$message.success(msg);
					} else {
						this.$message.erro(msg);
					}
				});
			},
			//头像上传成功
			handleUploadSuccess({ status, msg, src }) {
				this.ruleForm.avatar = src;
			},
		}
	}
</script>

<style>
	.el-form {
		width: 70%;
		margin: 0 auto;
	}
</style>
