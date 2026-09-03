import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import type { MessageEmit } from '@/env'

export type Option = {
  id: number
  item: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useStaticPagesCategory(emit: MessageEmit) {
  const router = useRouter()
  const keyword = ref<string>('')
  const options = ref<Option[]>([])
  const errorMessage = ref<string>('')

  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await axios.get<Option[]>(`${API_BASE_URL}/categories`)
      options.value = response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: 'カテゴリーの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  const submitSearch = (): void => {
    errorMessage.value = ''

    if (!keyword.value) {
      errorMessage.value = 'リスト内の項目を選択して下さい'
      return
    }

    router.push({
      name: 'SearchResults',
      params: { searchMethod: 'category' },
      query: { keyword: keyword.value }
    })
  }

  return {
    errorMessage,
    keyword,
    options,
    fetchCategories,
    submitSearch,
  }
}
