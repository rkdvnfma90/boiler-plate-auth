// 환경에 따라 exports 하는 모듈이 달라지도록 함
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod')
} else {
  module.exports = require('./dev')
}
