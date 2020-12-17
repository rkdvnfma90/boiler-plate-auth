import { LOGIN_USER, REGISTER_USER, AUTH_USER } from '../_actions/types'

// 리듀서에서 리턴된 값이 스토어로 들어간다.
export default function userReducer(state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      // 여기서 action.payload 는 로그인 후 서버에서 보내준 response.data 값이 들어있다.
      return { ...state, loginSuccess: action.payload }

    case REGISTER_USER:
      return { ...state, register: action.payload }

    // 서버에서 인증 후 사용자의 도큐먼트(객체)가 response 되므로 userData라고 명칭을 정했다.
    case AUTH_USER:
      return { ...state, userData: action.payload }
    default:
      return state
  }
}
