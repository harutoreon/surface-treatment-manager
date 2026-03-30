import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export function useLogin(emit) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const router = useRouter()
  const errorMessage = ref('')
  const name = ref('')
  const password = ref('')
  const selectedUserType = ref('')

  const changeToAdminUserData = () => {
    name.value = 'admin user'
    password.value = 'adminpassword'
  }

  const changeToGeneralUserData = () => {
    name.value = 'general user'
    password.value = 'generalpassword'
  }

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        name: name.value,
        password: password.value
      })
      localStorage.setItem('token', response.data.token)
      emit('message', { type: 'success', text: 'ログインしました。' })
      router.push('/home')
    } catch {
      errorMessage.value = 'ユーザー名またはパスワードが無効です'
    }
  }

  return {
    name,
    password,
    selectedUserType,
    errorMessage,
    changeToAdminUserData,
    changeToGeneralUserData,
    handleLogin
  }
}
