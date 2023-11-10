const http = require('http')
const routePathnameRequest = require('./utils');

const port = '9999';
const domainName = '127.0.0.1';

//创建服务
http.createServer((req, res) => {
    res.setHeader('content-type', 'text/json;charset=utf-8')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Origin-Method', '*')
    routePathnameRequest(req,res);
}).listen(port, domainName, () => {
    console.log(`服务器启动成功，可访问 http://${domainName}:${port}`);
})
