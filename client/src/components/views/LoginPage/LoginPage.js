import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom'

function LoginPage(props) {
  // 액션을 발생시키는 디스패쳐
  const dispatch = useDispatch()

  const [Email, setEmail] = useState('')
  const [Password, setPassword] = useState('')

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault()

    const body = {
      email: Email,
      password: Password,
    }
    // useCallback 으로 감싸면 좋다.
    // dispatch 하는 액션 객체의 payload가 promise이면 해당 promise를 리턴하는듯
    // loginUser(body) 의 payload는 response.data가 담긴 Promise이다.
    // 그러므로 then 으로 비동기 처리를 할 수 있는 것.
    // response 에는 리듀서에서 리턴한 값이 들어 있다.
    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        // 메인 페이지로 이동
        props.history.push('/')
      } else {
        alert('Error')
      }
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <form
        style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

// withRouter : 라우터 컴포넌트가 아닌 곳에서 math, location, history를 사용하기 위함
// 현재 페이지에서는 props.history를 사용하고 있음
export default withRouter(LoginPage)
