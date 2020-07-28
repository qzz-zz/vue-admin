import axios from 'axios';

// 获取商品列表
let list = (data) => axios.get('/api/goods/list',{params:data});
// 编辑商品
let edit = (data) => axios.put('/api/admin/goods',data);
//获取商品详情
let detail = (data) =>axios.get('/api/admin/goods',{params:data});
// 删除商品
let remove = (data) => axios.delete('/api/admin/goods',{params:data});
// 发布新商品
let release = (data) => axios.post('/api/admin/goods',data);

// 获取所有省份
let province = (data) => axios.get('/api/pcct/province',{params:data});
// 根据省份id获取城市
let city = (data) => axios.get('/api/pcct/city',{params:data});
// 根据市区id获取县区
let county = (data) => axios.get('/api/pcct/county',{params:data});

export default{
	list,
	edit,
	detail,
	remove,
	release,
	province,
	city,
	county,
}