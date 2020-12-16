const { User } = require('../models/User')

const auth = (req, res, next) => {
  // 인증 처리를 하는 곳

  // 클라이언트의 쿠키에서 토큰을 가져 온다
  const token = req.cookies.x_auth

  // 토큰을 복호화 한 후 유저를 찾고
  User.findByToken(token, (err, user) => {
    if (err) throw err
    if (!user) return res.json({ isAuth: false, error: true })

    // 여기 request에 담아준 이유는 해당 미들웨어를 사용하는 곳에서도 쓸수 있게 하기 위함
    req.token = token
    req.user = user

    // next 가 없으면 이 미들웨어에 계속 갇혀있다.
    next()
  })

  // 유저가 있으면 인증 ok

  // 없으면 인증 no
}

module.exports = { auth }
