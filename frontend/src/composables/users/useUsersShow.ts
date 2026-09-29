import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import type { MessageEmit } from '@/env'

export type UserResponse = {
  id: number
  name: string
  department: string
  admin: boolean
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useUsersShow(emit: MessageEmit) {
  const router = useRouter()
  const user = ref<UserResponse | null>(null)

  const fetchUserData = async (id: string): Promise<void> => {
    try {
      const response = await axios.get<UserResponse>(`${API_BASE_URL}/users/${id}`)
      user.value = response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: 'ユーザー情報の取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  return { user, fetchUserData }
}
