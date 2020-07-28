import axios from 'axios'

//删除图片
let remove = (data) => axios.delete('/api/upload',{params:data});

export default {
	remove,
}