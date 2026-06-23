import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export interface Sample {
  id: number
  name: string
  color: string
  hardness: string
  film_thickness: string
  feature: string
  summary: string
  maker_id: number
  category_id: number
}

export interface Emit {
  (event: 'message', payload: { type: 'success' | 'danger'; text: string }): void
}

export function useCategorySamples(emit: Emit) {
  const router = useRouter()
  const categorySamples = ref<Sample[]>([])

  const fetchCategorySamples = async (id: string): Promise<void> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/category_samples/category_id/${id}`)
      categorySamples.value = response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: 'サンプルリストの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  return { categorySamples, fetchCategorySamples }
}
