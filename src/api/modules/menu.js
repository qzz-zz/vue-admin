import axios from 'axios';

// 获取子菜单
let subcate = (data) => axios.get('/api/menu/sub',{params:data});
// 添加子菜单
let insert = (data) => axios.post('/api/menu',data);
// 更新子菜单
let edit = (data) => axios.put('/api/menu',data);
// 删除子菜单
let remove = (data) => axios.delete('/api/menu',{params:data});
// 获取所有element图标
let list =(data) => axios.get('/api/admin/icon/list',{params:data});
// 设置子菜单图标
 let set = (data)=> axios.put('/api/menu/icon',data);

export default{
	subcate,
	insert,
	edit,
	remove,
	list,
	set,
}