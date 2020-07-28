<template>
	<el-card class="box-card">
		<div slot="header">
			<span>编辑商品</span>
		</div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
			<el-form-item label="商品分类">
				<el-select v-model="ruleForm.cate_1st" placeholder="请选择商品分类">
					<el-option v-for="option in options_1st" :key="option.id" :label="option.name" :value="option.id"></el-option>
				</el-select>
				<el-select v-model="ruleForm.cate_2nd" placeholder="请选择商品分类">
					<el-option v-for="option in options_2nd" :key="option.id" :label="option.name" :value="option.id"></el-option>
				</el-select>
				<el-select v-model="ruleForm.cate_3rd" placeholder="请选择商品分类">
					<el-option v-for="option in options_3rd" :key="option.id" :label="option.name" :value="option.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="商品名称" prop="name">
				<el-row>
					<el-col :span="14">
						<el-input v-model="ruleForm.name" placeholder=""></el-input>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<div class="tip">商品标题名称长度至少3个字符，最长200个汉字</div>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item label="商品卖点" prop="hotPoint">
				<el-row>
					<el-col :span="14">
						<el-input type="textarea" v-model="ruleForm.hotPoint" placeholder=""></el-input>
					</el-col>
					<el-col :span="24">
						<div class="tip">商品卖点不能超过140个汉字</div>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item label="商品价格" prop="price">
				<el-row>
					<el-col :span="4">
						<el-input v-model="ruleForm.price" placeholder="">
							<template slot="append">元</template>
						</el-input>
					</el-col>
					<el-col :span="24">
						<div class="tip">价格必须是0-999999之间的数字，且不能高于市场价</div>
						<div class="tip">此价格为商品实际销售价格，如果商品存在规格，改价格显示最低价格</div>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item label="市场价" prop="marketPrice">
				<el-row>
					<el-col :span="4">
						<el-input v-model="ruleForm.marketPrice" placeholder="">
							<template slot="append">元</template>
						</el-input>
					</el-col>
					<el-col :span="24">
						<div class="tip">价格必须是0-999999之间的数字，此价格仅为市场参考价，请根据实际情况认真填写</div>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item label="成本价" prop="cost">
				<el-row>
					<el-col :span="4">
						<el-input v-model="ruleForm.cost" placeholder="">
							<template slot="append">元</template>
						</el-input>
					</el-col>
					<el-col :span="24">
						<div class="tip">价格必须是0-999999之间的数字，此价格为商户对所销售的商品的实际成本价进行备注记录，非必填选项，不会在前台销售页面中显示</div>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item label="折扣" prop="discount">
				<el-row>
					<el-col :span="4">
						<el-input v-model="discountRate" readonly="readonly">
							<template slot="append">折</template>
						</el-input>
					</el-col>
					<el-col :span="24">
						<div class="tip">根据销售价与市场价比例自动生成不需要编辑</div>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item label="商品库存" prop="inventory">
				<el-row>
					<el-col :span="4">
						<el-input v-model="ruleForm.inventory" placeholder="">
							<template slot="append">件</template>
						</el-input>
					</el-col>
					<el-col :span="24">
						<div class="tip">价格必须是0-999999之间的整数</div>
						<div class="tip">若启动了库存配置，则系统自动计算商品的总数，此处无需卖家填写</div>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item label="商品货号" prop="articleNo">
				<el-row>
					<el-col :span="4">
						<el-input v-model="ruleForm.articleNo" placeholder=""></el-input>
					</el-col>
					<el-col :span="24">
						<div class="tip">商品货号是商家管理商品的编号，买家不可见</div>
						<div class="tip">最多输入20个字符，只支持输入中文、字母、数字、_、/、-和小数点</div>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item label="商品主图" prop="img_md">
				<el-row>
					<el-col :span="4">
						<single-upload type="/api/upload/goods" :url="ruleForm.img_md" @success="handleUploadSuccess" @remove="ruleForm.img_md='' "></single-upload>
					</el-col>
					<el-col :span="24">
						<div class="tip">上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸
							800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中</div>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item label="商品轮播图" prop="slider">
				<el-row>
					<!-- <single-upload listType="picture-card" type="/api/upload/slider" :url="ruleForm.slider"  @success="handleUploadSuccess" @remove="ruleForm.slider='' "></single-upload> -->
					<el-upload action="/api/upload/slider" :file-list="fileList" list-type="picture-card" :on-preview="handlePictureCardPreview"
					 :on-remove="handleRemove" :on-success="handleSuccess" :before-upload="beforeAvatarUpload">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
					<el-col :span="24">
						<div class="tip">上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸
							800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中</div>
					</el-col>
				</el-row>
			</el-form-item>
			<div class="section-title">商品详情描述</div>
			<el-form-item label="商品品牌" prop="brand">
				<el-row>
					<el-col :span="14">
						<el-input v-model="ruleForm.brand" placeholder=""></el-input>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item label="商品描述" prop="detail">
				<div v-model="ruleForm.detail" ref="editor"></div>
			</el-form-item>
			<div class="section-title">商品物流信息</div>
			<el-form-item label="所在地" prop="place">
				<el-select v-model="ruleForm.place" placeholder="">
					<el-option label="山东省" value="山东省"></el-option>
				</el-select>
				<el-select v-model="ruleForm.place" placeholder="">
					<el-option label="青岛市" value="青岛市"></el-option>
				</el-select>
				<el-select v-model="ruleForm.place" placeholder="">
					<el-option label="城阳区" value="城阳区"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="运费" prop="freight">
				<el-row>
					<el-col :span="4">
						<el-input v-model="ruleForm.freight" placeholder="">
							<template slot="append">元</template>
						</el-input>
					</el-col>
					<el-col :span="24">
						<div class="tip">运费设为0，前台商品将显示免运费</div>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item>
				<el-button type="success" @click="saveForm('ruleForm')">提交</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	// wangEditor
	import E from 'wangeditor';
	import { Goods, Category } from '@/api/index';
	import SingleUpload from '@/components/SingleUpload.vue';
	export default {
		props: ['id'],
		components: {
			SingleUpload
		},
		data() {
			return {
				fileList: [],
				items: [],
				urlObj: {},
				urlArr: [],
				dialogImageUrl: '',
				dialogVisible: false,

				ruleForm: {
					cate_1st: '',
					cate_2nd: '',
					cate_3rd: '',
					name: '',
					hotPoint: '',
					price: '',
					marketPrice: '',
					cost: '',
					discount: '',
					inventory: '',
					articleNo: '',
					img_lg: '',
					img_md: '',
					slider: '',
					place: ['山东省'],
					detail: '',
					freight: '',
				},
				//声明三个数组
				options_1st: [],
				options_2nd: [],
				options_3rd: [],

				rules: {
					name: [
						{ required: true, message: '商品名称不能为空', trigger: 'blur' },
						// { pattern: /^[\u4e00-\u9fa5]{3,200}$/, message: '请输入正确的商品名称', trigger: 'blur' }
					],
					hotPoint: [
						{ required: true, message: '商品卖点不能为空', trigger: 'blur' },
						// { pattern: /^[\u4e00-\u9fa5]{0,140}$/, message: '请输入正确的商品卖点内容', trigger: 'blur' }
					],
					price: [
						{ required: true, message: '商品价格不能为空', trigger: 'blur' },
						// { pattern: /^[0-9]*$/, message: '请输入正确的商品价格', trigger: 'blur' }
					],
					marketPrice: [
						{ required: true, message: '市场价不能为空', trigger: 'blur' },
						// { pattern: /^[0-9]*$/, message: '请输入正确的市场价格', trigger: 'blur' }
					],
					cost: [
						{ required: true, message: '成本价不能为空', trigger: 'blur' },
						// { pattern: /^[0-9]*$/, message: '请输入正确的成本价', trigger: 'blur' }
					],
					inventory: [
						{ required: true, message: '商品库存不能为空', trigger: 'blur' },
						// { pattern: /^[0-9]*$/, message: '请输入正确的商品库存', trigger: 'blur' }
					],
					articleNo: [
						{ required: true, message: '商品货号不能为空', trigger: 'blur' },
						// { pattern: /^[\u4E00-\u9FA5A-Za-z0-9\.\-\/]{0,20}$/, message: '请输入正确的商品货号', trigger: 'blur' }
					],
					img_md: [
						{ required: true, message: '商品主图不能为空', trigger: 'blur' },
					],
					slider: [
						{ required: true, message: '商品轮播图不能为空', trigger: 'blur' },
					],
					freight: [
						{ required: true, message: '运费不能为空', trigger: 'blur' },
						// { pattern: /^[0-9]*$/, message: '请输入正确的运费价格', trigger: 'blur' }
					]
				},
			};
		},
		created() {
			this.loadSubcate(1).then((options) => {
				this.options_1st = options;
			});
			this.loadDetail(this.id);
		},
		watch: {
			"ruleForm.cate_1st": function(val) {
				this.loadSubcate(val).then((options) => {
					this.options_2nd = options;
				});
			},
			"ruleForm.cate_2nd": function(val) {
				this.loadSubcate(val).then((options) => {
					this.options_3rd = options;
				});
			}
		},
		computed: {
			discountRate() {
				if (this.ruleForm.price != '' && this.ruleForm.marketPrice != ''){
					let temp = parseFloat((this.ruleForm.price / this.ruleForm.marketPrice) * 10).toFixed(2) ;
					this.ruleForm.discount = temp;
					return temp;
				}	
			}
		},

		//wangEditor
		async mounted() {
			// 获取一级分类
			this.options_1st = await this.loadSubcate(1);
			// 获取商品详情
			let goods = await this.loadDetail(this.id);
			this.ruleForm = goods;
			///////////////////////
			//分割网址插入this.fileList图片就可以展示出来了
			this.items = this.ruleForm.slider.split(",");
			this.items.forEach(val => {
				this.urlObj.url = val;
				this.urlArr.push(val)
				this.fileList.push(this.urlObj);
				this.urlObj = {};
			});
			// 获取二级分类
			this.options_2nd = await this.loadSubcate(goods.cate_1st);
			/////////////////////////////
			var editor = new E(this.$refs.editor)
			editor.customConfig.onchange = (html) => {
				this.ruleForm.detail = html
			}
			editor.create()
			editor.txt.html(this.ruleForm.detail)
		},

		methods: {
			//获取商品详情
			async loadDetail(id) {
				let { status, data } = await Goods.detail({ id });
				if (status) {
					return data;
				}
			},
			//获取子分类
			async loadSubcate(id) {
				let { status, data } = await Category.subcate({ pId: id }); //id
				if (status) {
					return data;
				}
			},
			// 一级分类
			async handleCate_1stChange(val) {
				let options_2nd = await this.loadSubcate(goods.cate_1st);
				this.options_2nd = options;
				this.ruleForm.cate_2nd = options[0].id;
			},

			//保存修改
			saveForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (!valid) {
						//校验失败
						return false;
					}
					//校验成功
					let { status, msg } = await Goods.edit({ ...this.ruleForm });
					if (status) {
						this.$message.success("编辑成功！");
						this.$router.push('/goods/list');
					} else {
						this.$message.erro("编辑成功！");
					}
				});
			},
			//头像上传成功
			handleUploadSuccess({status, msg, mdImg}) {
				this.ruleForm.img_md = mdImg;
			},
			/////////////////////////////////////
			// 删除照片
			handleRemove(file, fileList) {
				this.urlArr = [];
				fileList.forEach(item => {
					this.urlArr.push(item.url);
					this.urlString = this.urlArr.join(",");
					this.ruleForm.slider = this.urlString;
				});
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			//上传成功
			handleSuccess(jsonData, field) { //上传图片成功传给后台的数据
				this.urlArr.push(jsonData.src);
				this.urlString = this.urlArr.join(",");
				this.ruleForm.slider = this.urlString;
			},
			//上传之前
			beforeAvatarUpload(file) {
				const isLt1M = file.size / 1024 / 1024 < 1;

				if (!isLt1M) {
					this.$message.error('上传图片大小不能超过 1MB!');
				}
				return isLt1M;
			},

		}
	}
</script>

<style scoped>
	.el-form-item__label {
		text-align: left;
	}

	.tip {
		font-size: 12px;
		color: #999;
	}

	.section-title {
		background-color: #f5f5f5;
		padding: 10px;
		margin-bottom: 10px;
	}
</style>
