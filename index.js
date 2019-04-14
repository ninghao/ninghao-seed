const axios = require('axios')
const poemData = require('./data/poem')
const usersData = require('./data/users')

const API_BASE = 'http://localhost:3000'
const API_USERS = `${API_BASE}/users`
const API_POSTS = `${API_BASE}/posts`
const API_AUTH_LOGIN = `${API_BASE}/auth/login`

const password = '111111'

const userLogin = async (user) => {
  return await axios.post(
    API_AUTH_LOGIN,
    {
      name: user,
      password
    })
}

const createUser = async (user) => {
  return await axios.post(
    API_USERS,
    {
      name: user,
      password
    })
}

const createPost = async (post, token) => {
  const { title, body } = post
  return await axios.post(
    API_POSTS,
    { title, body },
    {
      headers: { 'Authorization': `Bearer ${token}` }
    })
}

const seed = async (data) => {
  data.map(
    async (item) => {
      const { user, posts } = item
      let loginResponse

      if (user) {
        // 用户登录
        await userLogin(user)
          .then((response) => {
            loginResponse = response
          })
          .catch(async (error) => {
            const { response: { status } } = error
            if (status === 401) {
              const userResponse = await createUser(user)
                .then(async (response) => {
                  console.log('创建了用户：', response.data.name)
                  loginResponse = await userLogin(user)
                })
                .catch((error) => {
                  console.log(error.message);
                })
              return
            }
            console.log(error.message);
          })
      }

      // 提取 JWT
      const { data: { token } } = loginResponse

      // 创建内容
      if (posts) {
        item.posts.map(async (post) => {
          const postResponse = await createPost(post, token)
          console.log('创建了内容：', postResponse.data.title)
        })
      }

    }
  )
}

const seedData = async () => {
  await seed(usersData)
  await seed(poemData)
}

seedData()
