import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { MessageEmit } from '@/env'
import axios from 'axios'

export type Category = {
  id: number
  item: string
  summary: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useCategoriesShow(emit: MessageEmit) {
  const router = useRouter()
  const category = ref<Category | null>(null)

  const fetchCategoryData = async (id: string): Promise<void> => {
    try {
      const response = await axios.get<Category>(`${API_BASE_URL}/categories/${id}`)
      category.value = response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: 'カテゴリーの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  return { category, fetchCategoryData }
}
