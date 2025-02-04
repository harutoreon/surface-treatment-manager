const { ref } = require("vue")
// const setUser = require('./src/App.vue')

const user = ref(null)
const setUser = (newUser) => {
  user.value = newUser
}

describe('setUser', () => {
  test('sample', () => {
    // const user = ref(null)
    const newUser = { name: 'sample user' }
    setUser(newUser, user)
    expect(user.value).toEqual(newUser)
  })
})
