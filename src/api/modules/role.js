import axios from 'axios';

//获取角色列表
let list = (data) => axios.get('/api/role/list',{params:data});
//添加角色
let insert = (data) =>axios.post('/api/role',data);
//删除角色
let remove =(data) => axios.delete('/api/role',{params:data});
//编辑角色
let edit =(data) => axios.put('/api/role',data);
// 根据角色id获取菜单配置
let config=(data)=>axios.get('/api/role/config',{params:data});
// 为指定角色添加菜单
let configadd=(data)=>axios.post('/api/role/menu',data);
// 为指定角色删除菜单
let configremove =(data)=>axios.delete('/api/role/menu',{params:data});

export default{
	list,
	insert,
	remove,
	edit,
	config,
	configadd,
	configremove,
}
