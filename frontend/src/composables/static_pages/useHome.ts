import { ref } from 'vue'
import axios from 'axios'

export type LoggedInResponse = {
  payload: {
    user_id: number
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useHome() {
  const isAdmin = ref<boolean>(false)
  const containerSize = ref<string>('')

  const handleLogin = async (): Promise<void> => {
    const token: string = localStorage.getItem('token')
    const response = await axios.get<LoggedInResponse>(`${API_BASE_URL}/logged_in`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const ADMIN_USER: number = 49

    isAdmin.value = response.data.payload.user_id === ADMIN_USER
    containerSize.value = isAdmin.value ? 'container w-50' : 'container w-75'
  }

  return { isAdmin, containerSize, handleLogin }
}
