import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import type { MessageEmit } from '@/env'

export type Sample = {
  id: number
  name: string
  summary: string
  image_url: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useSearchResultsList(emit: MessageEmit) {
  const router = useRouter()
  const samples = ref<Sample[]>([])

  const fetchSearchResults = async (): Promise<void> => {
    try {
      const response = await axios.get<Sample[]>(`${API_BASE_URL}/list_search`)
      samples.value = response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: 'サンプルの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  return { samples, fetchSearchResults }
}
