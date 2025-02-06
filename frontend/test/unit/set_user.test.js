import { ref } from "vue"
import setUser from '../../src/App.vue'

process.env.VITE_API_BASE_URL = "http://localhost:3000"

describe('setUser', () => {
  test('sample', () => {
    const user = ref(null)
    const newUser = { name: 'admin user' }
    setUser(newUser, user)
    expect(user.value).toEqual(newUser)
  })
})
