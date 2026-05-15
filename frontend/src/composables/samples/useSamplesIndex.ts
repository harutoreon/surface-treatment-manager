import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

interface Sample {
  id: number
  name: string
  color: string
  feature: string
}

interface SampleListResponse {
  samples: Sample[]
  current_page: number
  total_pages: number
}

interface Emit {
  (event: 'message', payload: { type: 'success' | 'danger'; text: string }): void
}
export function useSamplesIndex(emit: Emit) {
  const route = useRoute()
  const router = useRouter()

  const samples = ref<Sample[]>([])
  const currentPage = ref<number>(Number(route.query.page) || 1)
  const totalPages = ref<number>(1)

  const fetchSampleList = async (): Promise<void> => {
    try {
      const response = await axios.get<SampleListResponse>(
        `${API_BASE_URL}/sample_list_with_pagination?page=${currentPage.value}`
      )
      samples.value = response.data.samples
      currentPage.value = response.data.current_page
      totalPages.value = response.data.total_pages
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: '表面処理リストの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  return {
    samples,
    currentPage,
    totalPages,
    fetchSampleList,
  }
}
