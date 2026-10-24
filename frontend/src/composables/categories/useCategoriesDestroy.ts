import { useRoute, useRouter } from 'vue-router'
import type { MessageEmit } from '@/env'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useCategoriesDestroy(emit: MessageEmit) {
  const route = useRoute()
  const router = useRouter()

  const handleDelete = async (): Promise<void> => {
    const confirmDelete: boolean = window.confirm('本当に削除しますか？')
    if (!confirmDelete) return

    try {
      await axios.delete(`${API_BASE_URL}/categories/${route.params.id}`)
      emit('message', { type: 'success', text: 'カテゴリーを1件削除しました。' })
      router.push('/categories')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: '削除処理に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  return { handleDelete }
}
