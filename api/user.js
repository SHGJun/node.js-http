//导入加密的模块 md5 (hash加密法 被破解 加盐（为了安全）)
const { v4 } = require('uuid')
const getPostParams = require('../utils/getPostParams');
const createToken = require('../utils/createTokenCheck');

//创建一个users数组来装对应的用户
let users = [
    {
        id: v4(),
        token: createToken.getToken('admin', 2),
        username: 'admin',
        password: '123456',
    }
]

// 注册接口
const register = (req, res) => {
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
                code: 401,
                message: '当前用户已经注册',
            }))
        } else {
            //创建一个新的用户
            let user = {
                id: v4(),
                username,
                password: password,
                createTime: new Date(),
                token:createToken.getToken(username, 2)
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
const login = (req, res) => {
    // 判断前端传来的用户名是否存在数据库中
    const currentLoginUser = (_users,username,pwd) => {

        // 用于判断正在登录的用户是否存在数据表中
        const userInfo = {
            isUser:false,
        };

        // 遍历数据库中的用户名数组
        _users.some(user => {
            // 判断当前登录的账号是否存在数据库   不存在
            if (user.username != username || user.password != pwd) return;
            // 判断当前登录的账号是否存在数据库   存在
            const obj = {
                user:user,
                isUser:true
            }
            Object.assign(userInfo,obj)
        });
        return userInfo;
    }

    getPostParams(req).then(({ username, password }) => {
        // 传入数据库用户名列表和前端传来的用户名
        const userInfo = currentLoginUser(users,username,password);
        // 判断当前登录的账号是否存在数据库
        if (userInfo.isUser) {
            res.write(JSON.stringify({
                code: '200',
                message: '登录成功',
                data: userInfo.user
            }))
        } else {
            res.write(JSON.stringify({
                code: '401',
                message: '用户名或密码错误，请检查后重试',
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