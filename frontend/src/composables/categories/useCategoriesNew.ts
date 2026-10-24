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

export function useCategoriesNew(emit: MessageEmit) {
  const router = useRouter()
  const item = ref<string>('')
  const summary = ref<string>('')
  const errorMessage = ref<string>('')

  const categoryRegistration = async (): Promise<void> => {
    errorMessage.value = ''

    try {
      const response = await axios.post<Category>(`${API_BASE_URL}/categories`, {
        category: {
          item: item.value,
          summary: summary.value
        }
      })
      emit('message', { type: 'success', text: 'カテゴリーを1件登録しました。' })
      router.push(`/categories/${response.data.id}`)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        errorMessage.value = '入力に不備があります。'
      }
    }
  }

  return {
    item,
    summary,
    errorMessage,
    categoryRegistration,
  }
}
