//内置querystring parse decode encode
const { decode } = require('querystring')

//封装返回对应的post请求的数据
const getPostParams = (req) => {
    return new Promise((resolve, reject) => {
        let params = ''
        //获取数据 body里面 观察者模式（event对象 http模块里面导入了event模块）
        //body里面的数据是分段传递的
        //监听请求数据的传递 
        req.on('data', (chunk) => {
            params += chunk
        })
        //监听请求结束
        req.on('end', () => {
            //queryString 自动将对应的请求字符串转为对象
            resolve(decode(params))
        })
        //监听请求出错
        req.on('error', (error) => {
            reject(error)
        })
    })
}

// 暴露出去，其他地方调用就行
module.exports = getPostParams