<template>
	<div>
		<el-card class="box-card">
			<div slot="header">
				<span>用户列表</span>
			</div>
			<el-table :data="tableData" style="width: 100%;">
				<el-table-column prop="id" label="#">
				</el-table-column>
				<el-table-column prop="avatar" label="头像" sortable>
					<template slot-scope="scope">
						<el-avatar shape="circle" style="width: 50px; height: 50px" :src="scope.row.avatar"></el-avatar>
					</template>
				</el-table-column>
				<el-table-column prop="username" label="账号" sortable>
				</el-table-column>
				<el-table-column prop="fullname" label="姓名" sortable>
				</el-table-column>
				<el-table-column prop="sex" label="性别" sortable>
				</el-table-column>
				<el-table-column prop="tel" label="手机" sortable width="115">
				</el-table-column>
				<el-table-column prop="role_name" label="角色" sortable width="160">
					<template slot-scope="scope">
						<el-tag :type="scope.row.role_name == '超级管理员' ? 'danger' : ''">{{scope.row.role_name}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="login_time" label="上次登录" sortable width="160">
				</el-table-column>
				<el-table-column prop="login_count" label="登录次数" sortable width="160">
				</el-table-column>
				<el-table-column prop="" label="操作" width="200">
					<template slot-scope="scope">
						<el-button type="primary" @click="editAdmin(scope.row, scope.$index)" size="mini" icon="el-icon-edit" plain></el-button>
						<el-button :disabled="scope.row.role_name == '超级管理员'" type="danger" @click="removeAdmin(scope.row.id, scope.$index)" size="mini" icon="el-icon-delete" plain></el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 编辑弹出框 -->
		<el-dialog title="修改信息" :visible.sync="editModalShow">
			<el-form :model="editForm" :rules="rules" ref="editForm" label-position="left">
				<el-form-item label="姓名" prop="fullname"label-width="80px">
					<el-input v-model="editForm.fullname" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex" label-width="80px">
					<el-radio-group v-model="editForm.sex">
						<el-radio label="男"></el-radio>
						<el-radio label="女"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="手机" prop="tel" label-width="80px">
					<el-input v-model.number="editForm.tel"></el-input>
				</el-form-item>
				<el-form-item label="权限" prop="role" label-width="80px">
					<el-select v-model="editForm.role">
						<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="头像" prop="avatar" label-width="80px">
					<single-upload type="/api/upload/avatar" :url="editForm.avatar" 
					@success="handleUploadSuccess" @remove="editForm.avatar='' "></single-upload>
				</el-form-item>
				<el-form-item class="footer">
					<el-button @click="editModalShow = false">取 消</el-button>
					<el-button @click="handleEdit('editForm')" type="primary">保 存</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>

</template>

<script>
	import { Admin, Role } from '@/api/index';
	import SingleUpload from '@/components/SingleUpload.vue';
	export default {
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
				tableData: [],
				editModalShow: false,

				ruleForm: {
					id:'',
					avatar: '',
					username:'',
					fullname: '',
					sex:'',
					tel:'',
					role: '',
					login_time:'',
					login_count:'',
				},
				editForm: {
					fullname: '',
					sex: '',
					tel: '',
					role: '',
					avatar:'',
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
					role_name:[{
						required: true,
						message: '请选择权限角色',
						trigger: 'blur'
					}],
					avatar: [{
						required: true,
						message: '请上传头像',
						trigger: 'blur'
					}],
				}
			}
		},
		async created() {
			this.loadList();
			this.options = await this.loadRole(1);
		},
	
		methods: {
			//获取管理员列表
			async loadList() {
				let { status, total, data } = await Admin.list();
				if (status) {
					data.forEach((item) => {
						item.avatar =item.avatar.replace('..', '');
					});
					this.tableData = data;

				}
			},
			// 加载角色分类
			async loadRole(id) {
				let { status, data } = await Role.list();
				if (status) {
					// this.options=data;
					return data;
				}
			},
			//编辑框获取信息
			editAdmin(data,index) {
				this.editForm = { ...data };
				this.editModalShow = true;
			},
			//保存修改
			handleEdit(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (!valid) {
						//校验失败
						return false;
					}
					//校验成功
					let { status, msg } = await Admin.edit({ ...this.editForm });
					if (status) {
						this.loadList();
						this.$message.success(msg);
						this.editModalShow = false;
					} else {
						this.$message.erro(msg);
					}
				});
			},
			
			//删除管理员
			removeAdmin(id, i) {
				this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
						type: 'warning'
					})
					.then(async () => {
						let {status} = await Admin.remove({id:id});
						if(status){
							//更新DOM
							this.tableData.splice(i,1);
							this.$message.success('删除成功!');
						}
					})
					.catch(() => {
						this.$message.info('已取消删除');
					});
			},

			//头像上传成功
			handleUploadSuccess({ status, msg, src }) {
				this.editForm.avatar = src;
			},
		}
	}
</script>

<style>
	.am-margin-right-sm {
		margin-right: 10px;
	}
	.footer {
		padding: 10px 20px 0 20px;
		text-align: right;
		box-sizing: border-box;
	}
</style>
