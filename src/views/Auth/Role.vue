<template>
	<div>
		<el-col :span="10">
			<el-card class="box-card">
				<div slot="header">
					<span>角色列表</span>
					<el-button type="primary" @click="openInsertModal" plain icon="el-icon-circle-plus-outline" style="float: right;">添加角色</el-button>
				</div>
				<el-table :data="tableData" style="width: 100%">
					<el-table-column prop="id" label="#">
					</el-table-column>
					<el-table-column label="角色">
						<template slot-scope="scope">
							<el-tag :type="scope.row.name == '超级管理员' ? 'danger' : ''">{{scope.row.name}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="200">
						<template slot-scope="scope">
							<el-button type="primary" size="mini" icon="el-icon-edit" @click="editRole(scope.row.id, scope.row.name, scope.$index)"
							 :disabled="scope.row.name == '超级管理员'" plain></el-button>
							<el-button type="danger" size="mini" icon="el-icon-delete" @click="removeRole(scope.row.id, scope.$index)"
							 :disabled="scope.row.name == '超级管理员'" plain></el-button>
							<el-button type="primary"  @click="handleSetting(scope.row.id)" size="mini" icon="el-icon-setting" plain></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</el-col>
		<el-col :span="14">
			<el-card class="box-card config-card" v-for="(item,index) in config">
				<div slot="header" class="clearfix">
					<i class="el-icon-collection-tag" style="color: #409eff; font-size: 14px;"></i>
					<span style="color: #409eff; font-size: 14px;">{{item.name}}</span>
					<el-switch v-model="item.checked" style="float: right; padding: 3px 0" @change="changeAll(item.id,index)"></el-switch>
				</div>

				<div v-for="(it,idx) in item.children" class="text item">
					<span style="color: #909399; font-size: 12px; display: inline-block;">{{it.name}}</span>
					<el-switch v-model="it.checked" style="float: right; " @change="changeSingle(it.id,idx,index)"></el-switch>
				</div>

			</el-card>
		</el-col>
	</div>
</template>

<script>
	import { Role } from '@/api/index';
	export default {
		data() {
			return {
				tableData: [],
				form: {
					id: '',
					name: '',
				},

				cardVisible: false,
				config: [],
				value: '',
				role_id: '',

				configEdit: {
					role_id: '',
					menu_id: '',
				},
			}
		},
		created() {
			this.loadList();
		},
		methods: {
			async loadList() {
				let { status, total, data } = await Role.list();
				if (status) {
					this.tableData = data;
				}
			},
			//添加角色
			openInsertModal() {
				this.$prompt('请输入添加的角色名称', '添加角色', {
						inputPattern: /\S/,
						inputErrorMessage: '输入不能为空白字符'
					})
					.then(async ({ value }) => {
						let { status, data } = await Role.insert({ name: value });
						if (status) {
							//手动更新DOM
							this.tableData.push({ name: value, ...data }); //...data是为了把data数据展开得到里面的id操作列
							this.$message.success('添加成功');
						}
					})
					.catch(() => {
						this.$message.info('取消添加');
					});
			},
			//删除角色
			removeRole(id, i) {
				this.$confirm('此操作将永久删除该角色及其关联账户, 是否继续?', '提示', {
						type: 'warning'
					})
					.then(async () => {
						let { status } = await Role.remove({ id: id });
						if (status) {
							this.tableData.splice(i, 1);
							this.$message.success('删除成功!');
						}
					})
					.catch(() => {
						this.$message.info('已取消删除');
					});
			},
			//编辑角色
			editRole(id, name, i) {
				this.$prompt('请输入编辑的角色名称', '编辑角色', {
						inputPattern: /\S/,
						inputErrorMessage: '输入不能为空白字符',
						inputValue: name,
					})
					.then(async ({ value }) => {
						let { status } = await Role.edit({ id: id, name: value });
						if (status) {
							//手动更新DOM
							this.tableData[i].name = value;
							this.$message.success('编辑成功');
						}
					})
					.catch(() => {
						this.$message.info('取消编辑');
					});
			},
			/////////////////////////////
			async handleSetting(id) {
				this.configEdit.role_id = id;
				this.cardVisible = true;
				let { status, data } = await Role.config({ id: id });
				if (status) {
					this.config = data;
					// console.log(this.config);
				}
			},
			async changeAll(menu_id, index) {
				//赋值
				this.configEdit.menu_id = menu_id;
				if (!this.config[index].checked) {
					// console.log(this.configEdit);
					let { status, data } = await Role.configremove(this.configEdit);
					for (var i = 0; i < this.config[index].children.length; i++) {
						this.config[index].children[i].checked = false;
						var id = this.config[index].children[i].id;
						this.configEdit.menu_id = id;
						let { status, data } = await Role.configremove(this.configEdit);
					}
				} else {
					let { status, data } = await Role.configadd(this.configEdit);
					for (var i = 0; i < this.config[index].children.length; i++) {
						this.config[index].children[i].checked = true;
						var id = this.config[index].children[i].id;
						this.configEdit.menu_id = id;
						let { status, data } = await Role.configadd(this.configEdit);
					}
				}
			},
			async changeSingle(menu_id, index, index_pa) {
				// console.log(menu_id,index,index_pa);
				this.configEdit.menu_id = menu_id;
				if (!this.config[index_pa].children[index].checked) {
					let { status, data } = await Role.configremove(this.configEdit);
					var num = 0;
					for (var i = 0; i < this.config[index_pa].children.length; i++) {
						if (this.config[index_pa].children[i].checked) {
							num++;
						}
					}
					if (num >= 1) {
						this.config[index_pa].checked = true;
						this.configEdit.menu_id = this.config[index_pa].id;
						let { status, data } = await Role.configadd(this.configEdit);
					} else {
						this.config[index_pa].checked = false;
						this.configEdit.menu_id = this.config[index_pa].id;
						let { status, data } = await Role.configremove(this.configEdit);
					}
				} else {
					let { status, data } = await Role.configadd(this.configEdit);
					var num = 0;
					for (var i = 0; i < this.config[index_pa].children.length; i++) {
						if (this.config[index_pa].children[i].checked) {
							num++;
						}
					}
					if (num >= 1) {
						this.config[index_pa].checked = true;
						this.configEdit.menu_id = this.config[index_pa].id;
						let { status, data } = await Role.configadd(this.configEdit);
					} else {
						this.config[index_pa].checked = false;
						this.configEdit.menu_id = this.config[index_pa].id;
						let { status, data } = await Role.configremove(this.configEdit);
					}
				}
			}
		}
	}
</script>

<style>
	.config-card {
		margin-left: 10px;
		margin-bottom: 10px;
	}

	.text {
		margin-bottom: 10px;
	}
</style>
