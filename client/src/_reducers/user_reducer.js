import { LOGIN_USER } from '../_actions/types'

// 리듀서에서 리턴된 값이 스토어로 들어간다.
export default function userReducer(state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      // 여기서 action.payload 는 로그인 후 서버에서 보내준 response.data 값이 들어있다.
      return { ...state, loginSuccess: action.payload }
    default:
      return state
  }
}
