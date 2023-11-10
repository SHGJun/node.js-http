//导入加密的模块 md5 (hash加密法 被破解 加盐（为了安全）)
const md5 = require('md5')
const getPostParams  = require('../utils/getPostParams');
const createToken = require('../utils/createTokenCheck');

//创建一个users数组来装对应的用户
const users = [
    {
        username:'admin',
        password:'123456'
    }
]

// 注册接口
const register = (req,res) => {
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
}

// 登录接口
const login = (req,res) => {
    getPostParams(req).then(({username,password}) => {
        //根据获取的参数进行对应的操作（验证）
        let filter = users.filter(user => {
            user.token = createToken.getToken(user.username,2)
            return username == user.username && password == user.password
        })
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
}

module.exports = {
    users,
    register,
    login
}