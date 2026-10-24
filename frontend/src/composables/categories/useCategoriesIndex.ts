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

export function useCategoriesIndex(emit: MessageEmit) {
  const router = useRouter()
  const categories = ref<Category[]>([])

  function replaceStringWithEllipsis(): void {
    for (const category of categories.value) {
      if (category.summary.length > 10) {
        category.summary = category.summary.slice(0, 10) + '...'
      }
    }
  }

  const fetchCategoryList = async (): Promise<void> => {
    try {
      const response = await axios.get<Category[]>(`${API_BASE_URL}/categories`)
      categories.value = response.data
      replaceStringWithEllipsis()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: 'カテゴリーの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  return {
    categories,
    replaceStringWithEllipsis,
    fetchCategoryList,
  }
}
