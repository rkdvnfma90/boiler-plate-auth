import React, { useEffect } from 'react'
import axios from 'axios'

function LandingPage() {
  useEffect(() => {
    // 서버에서 보내준 response를 받아서 출력 해 준다.
    axios.get('/api/hello').then((res) => console.log(res.data))
  }, [])

  return <div>LandingPage</div>
}

export default LandingPage
