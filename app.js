//实现登录注册功能
//导入模块
const http = require('http')
//第三方模块 uuid 生成id的 生成一个32位的id（不重复的）
// const { v4 } = require('uuid')
// const { resolve } = require('path')
//导入加密的模块 md5 (hash加密法 被破解 加盐（为了安全）)
// const md5 = require('md5')
const routePathnameRequest = require('./utils');

// 设置相应Header
const setHeaderInfo = (res) => {
    //设置响应头
    res.setHeader('content-type', 'text/json;charset=utf-8')
    //解决跨域问题
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Origin-Method', '*')
}

//创建服务
http.createServer((req, res) => {
    setHeaderInfo(res);
    routePathnameRequest(req,res);
}).listen('9999', '127.0.0.1', () => {
    console.log('server is running,at 127.0.0.1:9999')
})
