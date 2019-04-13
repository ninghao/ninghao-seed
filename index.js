const axios = require('axios')
const poemData = require('./data/poem')

const API_BASE = 'http://localhost:3000'
const API_USERS = `${API_BASE}/users`
const API_POSTS = `${API_BASE}/posts`
const API_AUTH_LOGIN = `${API_BASE}/auth/login`

const seed = (data) => {
  data.map(
    async (item) => {
      try {
        // 创建用户
        const userResponse = await axios.post(
          API_USERS,
          {
            name: item.user,
            password: '111111'
          })

        console.log('创建了用户：', userResponse.data.name)

        // 用户登录
        const loginResponse = await axios.post(
          API_AUTH_LOGIN,
          {
            name: item.user,
            password: '111111'
          })

        // 获取 JWT
        const { token } = loginResponse.data

        // 创建内容
        item.posts.map(async (post) => {
          const { title, body } = post

          const postResponse = await axios.post(
            API_POSTS,
            { title, body },
            {
              headers: { 'Authorization': `Bearer ${token}` }
            })

          console.log('创建了内容：', postResponse.data.title)
        })
      } catch (error) {
        console.log(error.message)
      }
    }
  )
}

seed(poemData);
