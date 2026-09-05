import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import type { MessageEmit } from '@/env'

type Sample = {
  id: number
  name: string
  feature: string
  color: string
}

type DataResponse = {
  samples: Sample[]
  keyword: string
}

export function useSearchResults(emit: MessageEmit) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const route = useRoute()
  const router = useRouter()
  const data = ref<DataResponse | null>(null)
  const samples = ref<Sample[]>([])
  const searchMethod = ref<string | string[]>('')

  const fetchSearchResults = async (): Promise<void> => {
    const keyword= route.query.keyword as string | string[]
    searchMethod.value = route.params.searchMethod as string | string[]

    try {
      const response = await axios.get<DataResponse>(`${API_BASE_URL}/${searchMethod.value}_search`, {
        params: { keyword: keyword }
      })
      data.value = response.data
      samples.value = response.data.samples
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: 'サンプルの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  return { data, samples, searchMethod, fetchSearchResults }
}
