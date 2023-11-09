//实现登录注册功能
//导入模块
const http = require('http')
const { parse } = require('url')
//内置querystring parse decode encode
const { decode } = require('querystring')
//第三方模块 uuid 生成id的 生成一个32位的id（不重复的）
const { v4 } = require('uuid')
const { resolve } = require('path')
//导入加密的模块 md5 (hash加密法 被破解 加盐（为了安全）)
const md5 = require('md5')
const createToken = require('./utils/createTokenCheck')
//创建一个users数组来装对应的用户
let users = [
    {
        username:'admin',
        password:'123456'
    }
]
//创建服务
http.createServer((req, res) => {
    //设置响应头
    res.setHeader('content-type', 'text/json;charset=utf-8')
    //解决跨域问题
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Origin-Method', '*')
    //解构拿出对应的路由地址和get的参数
    let {
        pathname,
        query
    } = parse(req.url, true)
    //根据路由的路径进行判断
    switch (pathname) {
        case "/login": //登录 post
            getPostParams(req).then(({
                username,
                password
            }) => {
                //根据获取的参数进行对应的操作（验证）
                let filter = users.filter(user => {
                    user.token = createToken.getToken(user.username,2)
                    return username == user.username && password == user.password
                })
                console.log(filter)
                if (filter[0]) {
                    res.write(JSON.stringify({
                        code: '200',
                        message: '登录成功',
                        data: filter[0]
                    }))
                } else {
                    res.write(JSON.stringify({
                        code: '401',
                        message: '登录失败，该用户不存在，请检查账号密码后重试',
                    }))
                }
                res.end()
            })
            break;
        case "/register": //注册 post
            getPostParams(req).then(({
                username,
                password,
                sex,
                address
            }) => {
                //判断当前用户是否已经注册
                if (users.some(user => user.username == username)) {
                    //当前用户已经存在
                    res.write(JSON.stringify({
                        code: 200,
                        message: '当前用户已经注册',
                        data: null
                    }))
                } else {
                    let slat = Math.ceil(Math.random() * 1000 + 1000).toString(36)
                    //创建一个新的用户
                    let user = {
                        id: v4(),
                        username,
                        password: md5(password + slat),
                        // sex: sex ? sex : '男',
                        // address: address ? address : '中国北京',
                        createTime: new Date(),
                        slat //为了解密
                    }
                    //添加用户
                    users.push(user)
                    res.write(JSON.stringify({
                        code: 200,
                        message: '注册成功',
                        data: user
                    }))
                }
                res.end()
            })
            break;
        case "/searchByID": //根据id查找对应的用户 get
            //监听请求数据传递 获取传递的数据id http://127.0.0.1:9999/searchByID?id=1
            // req.url存在传递的数据 对于的数据里面?传递的参数进行提取
            // console.log(queryByUrl(req.url));
            //得到get传递的参数
            // let params = queryByUrl(req.url) 
            //通过参数去找对应的uers里面的数据 返回对应的数据
            let filterArr = users.filter(user => user.id == query.id)
            if (filterArr[0]) { //有这个id
                //只能写字符串和buffer类型
                res.write(JSON.stringify({
                    code: 200,
                    message: 'OK',
                    data: filterArr[0]
                }))
            } else { //没有这个id
                res.write(JSON.stringify({
                    code: 200,
                    message: 'OK',
                    data: null
                }))
            }
            res.end()
            break;
    }
}).listen('9999', '127.0.0.1', () => {
    console.log('server is running,at 127.0.0.1:9999')
})
//封装返回对应的post请求的数据
const getPostParams = (req) => {
    return new Promise((resolve, reject) => {
        let params = ''
        console.log(req)
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
