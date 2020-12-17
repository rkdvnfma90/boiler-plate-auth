import axios from 'axios'
import { LOGIN_USER } from './types'

export function loginUser(dataToSubmit) {
  // response.data를 request에 담는다.
  const request = axios
    .post('/api/users/login', dataToSubmit)
    .then((response) => response.data)

  // 리듀서로 리턴함
  return {
    type: LOGIN_USER,
    payload: request,
  }
}