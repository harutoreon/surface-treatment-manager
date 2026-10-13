import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { MessageEmit } from '@/env'
import type { Ref } from 'vue'
import type { Category } from '@/composables/categories/useCategoriesShow'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useCategoriesEdit(emit: MessageEmit, category: Ref<Category>) {
  const router = useRouter()
  const errorMessage = ref('')
  const updatedCategory = ref<Category | null>(null)

  const categoryUpdate = async (): Promise<void> => {
    errorMessage.value = ''

    try {
      const response = await axios.patch<Category>(`${API_BASE_URL}/categories/${category.value.id}`, {
        item: category.value.item,
        summary: category.value.summary
      })
      updatedCategory.value = response.data
      emit('message', { type: 'success', text: 'カテゴリー情報を更新しました。' })
      router.push(`/categories/${response.data.id}`)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        errorMessage.value = '入力に不備があります。'
      }
    }
  }

  return {
    updatedCategory,
    errorMessage,
    categoryUpdate,
  }
}
