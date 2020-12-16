const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const someOtherPlaintextPassword = 'not_bacon'

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
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return callback(err), callback(null, isMatch)
  })
}

// 모델 생성
const User = mongoose.model('User', userSchema)

// 유저 모델 export
module.exports = { User }
