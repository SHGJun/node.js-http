// 引入 jsonwebtoken
let jwt = require('jsonwebtoken');

let lingpai = 'weislingpai'
const createTokenCheck = {
  // 生成的token。并设置过期时间 
  getToken(jiamiData,expiresIn=3){
    return jwt.sign({
      data: jiamiData
    }, lingpai, { expiresIn: expiresIn })
  },
  // 检查token是否过期
  verify(token){
    try {
     return jwt.verify(token, lingpai)
    } catch (error) {
      // 如果报错返回false.[因为token有可能过期，就会报错]
      console.log('error:', error)
      return false
    }
  }
}
// 暴露出去，其他地方调用就行
module.exports = createTokenCheck
