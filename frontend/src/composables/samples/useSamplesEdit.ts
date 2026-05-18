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
  image_url: string
}

export interface Emit {
  (event: 'message', payload: { type: 'success' | 'danger'; text: string }): void
}

export function useSamplesEdit(emit: Emit) {
  const router = useRouter()
  const sample = ref<Sample | null>(null)
  const image = ref<File | null>(null)
  const errorMessage = ref<string>('')

  const fetchSampleData = async (id: string): Promise<void> => {
    try {
      const response = await axios.get<Sample>(
        `${API_BASE_URL}/samples/${id}`
      )
      sample.value = response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: '表面処理情報の取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  const sampleUpdate = async (): Promise<void> => {
    try {
      const formData = new FormData()
      formData.append('sample[name]', sample.value.name)
      formData.append('sample[color]', sample.value.color)
      formData.append('sample[hardness]', sample.value.hardness)
      formData.append('sample[film_thickness]', sample.value.film_thickness)
      formData.append('sample[feature]', sample.value.feature)
      formData.append('sample[summary]', sample.value.summary)
      formData.append('sample[category_id]', sample.value.category_id.toString())
      formData.append('sample[maker_id]', sample.value.maker_id.toString())

      if (image.value) {
        formData.append('sample[image]', image.value)
      }

      const response = await axios.patch(
        `${API_BASE_URL}/makers/${sample.value.maker_id}/samples/${sample.value.id}`,
        formData, { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      sample.value = response.data
      emit('message', { type: 'success', text: '表面処理情報を更新しました。' })
      router.replace(`/samples/${sample.value.id}`)
    } catch(error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        errorMessage.value = '入力に不備があります。'
      }
    }
  }

  return {
    sample,
    image,
    errorMessage,
    fetchSampleData,
    sampleUpdate,
  }
}
