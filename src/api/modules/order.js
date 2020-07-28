import axios from 'axios';

// 获取所有账户订单列表
let allList = (data) => axios.get('/api/admin/order/list',{params:data});

export default{
	allList,
}