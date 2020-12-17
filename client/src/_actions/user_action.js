import axios from 'axios'
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from './types'

export function loginUser(dataToSubmit) {
  // 서버에서 보낸 response를 request에 담는다.
  // 현재 request는 resolve에 response.data가 담긴 Promise이다.
  const request = axios
    .post('/api/users/login', dataToSubmit)
    .then((response) => response.data)

  // 리듀서로 리턴함
  return {
    type: LOGIN_USER,
    payload: request,
  }
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post('/api/users/register', dataToSubmit)
    .then((response) => response.data)

  return {
    type: REGISTER_USER,
    payload: request,
  }
}

// GET 방식으로 요청하므로 body는 필요 없다.
export function auth() {
  const request = axios.get('/api/users/auth').then((response) => response.data)

  return {
    type: AUTH_USER,
    payload: request,
  }
}
