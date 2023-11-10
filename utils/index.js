const { login, register } = require('../services/user');
const { parse } = require('url');


module.exports = (req,res) => {

    //解构拿出对应的路由地址和get的参数
    const {
        pathname,
        query
    } = parse(req.url, true)
    //根据路由的路径进行判断
    switch (pathname) {
        case "/login": //登录 post
            login(req, res)
            break;
        case "/register": //注册 post
            register(req, res)
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
}
