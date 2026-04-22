import { ref } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useHome() {
  const isAdmin = ref(false)
  const containerSize = ref('')

  const handleLogin = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_BASE_URL}/logged_in`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    isAdmin.value = response.data.payload.user_id === 49
    containerSize.value = isAdmin.value ? 'container w-50' : 'container w-75'
  }

  return { isAdmin, containerSize, handleLogin }
}
