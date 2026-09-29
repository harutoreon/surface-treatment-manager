import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import type { MessageEmit } from '@/env'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useUsersDestroy(emit: MessageEmit) {
  const route = useRoute()
  const router = useRouter()

  const handleDelete = async (): Promise<void> => {
    const confirmDelete: boolean = window.confirm('本当に削除しますか？')
    if (!confirmDelete) return

    try {
      await axios.delete(`${API_BASE_URL}/users/${route.params.id}`)
      emit('message', { type: 'success', text: 'ユーザー情報を削除しました。' })
      router.replace('/users')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: 'ユーザー情報の削除に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  return { handleDelete }
}
