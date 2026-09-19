import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import type { MessageEmit } from '@/env'

export type User = {
  id: number
  name: string
  department: string
  admin: boolean
}

export type UsersResponse = {
  users: User[]
  current_page: number
  total_pages: number
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useUsersIndex(emit: MessageEmit) {
  const router = useRouter()
  const users = ref<User[]>([])
  const currentPage = ref<number>(1)
  const totalPages = ref<number>(1)

  const fetchUserList = async (): Promise<void> => {
    try {
      const response = await axios.get<UsersResponse>(`${API_BASE_URL}/users`, {
        params: { page: currentPage.value }
      })
      users.value = response.data.users
      currentPage.value = response.data.current_page
      totalPages.value = response.data.total_pages
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: 'ユーザーリストの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  return {
    users,
    currentPage,
    totalPages,
    fetchUserList,
  }
}
