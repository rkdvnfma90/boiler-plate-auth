const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const config = require('../config/key')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
})

// 이 스키마에 대해 저장하기 전에 작업을 함
userSchema.pre('save', function (next) {
  // 여기서 this는 userSchema 내부에 있는 값이다.
  const user = this

  // 유저의 비밀번호가 변경이 되었을 때만 암호화 해준다.
  if (user.isModified('password')) {
    // 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err)
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err)
        // hash가 암호화된 비밀번호 이다.
        user.password = hash
        // 이 함수에서 작업할 거 다하고 next함수를 호출한다. 지금 여기서는 index.js의 user.save
        next()
      })
    })
  } else {
    next()
  }
})

userSchema.methods.comparePassword = function (plainPassword, callback) {
  // 화살표 함수를 사용하면 this가 상위 렉시컬 스코프를 가리키기 때문에 user를 찾을 수 없다.
  const user = this

  bcrypt.compare(plainPassword, user.password, function (err, isMatch) {
    if (err) return callback(err)
    callback(null, isMatch)
  })
}

userSchema.methods.generateToken = function (callback) {
  const user = this
  // jwt 사용하여 토큰 생성하기
  const token = jwt.sign(user._id.toHexString(), config.tokenKey)

  user.token = token
  user.save((err, user) => {
    if (err) return callback(err)
    callback(null, user)
  })
}
/* https://github.com/bestdevhyo1225/dev-log/blob/master/MongoDB/Mongoose-statics-methods.md 참조
  스키마.methods 에서의 this는 this가 호출한 대상을 가리킨다. 예를들어
  user.generateToken 하면 this는 user를 가리키는 것.
  statics는 this가 모델 그 자체를 가리킨다. 즉 mongoose 모델 (User) 를 가리키는 것 (조회할때 주로 사용)
  그렇기 때문에 findByToken에서 mongoose 함수인 findOne을 호출 할 수 있는 것이다.
*/
userSchema.statics.findByToken = function (token, callback) {
  const user = this

  // 토큰을 decode 한다.
  jwt.verify(token, config.tokenKey, function (err, decoded) {
    // 유저 아이디를 이용해서 유저를 찾은 다음에
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne(
      {
        _id: decoded,
        token: token,
      },
      function (err, user) {
        if (err) return callback(err)
        callback(null, user)
      }
    )
  })
}

// 모델 생성
const User = mongoose.model('User', userSchema)

// 유저 모델 export
module.exports = { User }
