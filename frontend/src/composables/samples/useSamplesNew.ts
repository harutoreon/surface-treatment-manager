import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export interface Maker {
  id: number
  name: string
}

export interface Category {
  id: number
  item: string
  summary: string
}

export interface Emit {
  (event: 'message', payload: { type: 'success' | 'danger'; text: string }): void
}

export function useSamplesNew(emit: Emit) {
  const router = useRouter()
  const makerOptions = ref<Maker[]>([])
  const categoryOptions = ref<Category[]>([])
  const name = ref<string>('')
  const color = ref<string>('')
  const hardness = ref<string>('')
  const feature = ref<string>('')
  const categoryId = ref<number | null>(null)
  const makerId = ref<number | null>(null)
  const filmThickness = ref<string>('')
  const summary = ref<string>('')
  const image = ref<File | null>(null)
  const errorMessage = ref<string>('')

  const fetchMakerData = async (): Promise<void> => {
    try {
      const response = await axios.get<Maker[]>(`${API_BASE_URL}/maker_list`)
      makerOptions.value = response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: 'メーカーの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await axios.get<Category[]>(`${API_BASE_URL}/categories`)
      categoryOptions.value = response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: 'カテゴリーの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  const sampleRegistration = async (): Promise<void> => {
    try {
      const formData = new FormData()
      formData.append('sample[name]', name.value)
      formData.append('sample[color]', color.value)
      formData.append('sample[hardness]', hardness.value)
      formData.append('sample[feature]', feature.value)
      formData.append('sample[category_id]', categoryId.value.toString())
      formData.append('sample[maker_id]', makerId.value.toString())
      formData.append('sample[film_thickness]', filmThickness.value)
      formData.append('sample[summary]', summary.value)
      if (image.value) {
        formData.append('sample[image]', image.value)
      }

      const response = await axios.post(`${API_BASE_URL}/makers/${makerId.value}/samples`,
        formData, { headers: { 'Content-Type': 'multipart/form-data' }
      })
      emit('message', { type: 'success', text: '表面処理情報を1件登録しました。' })
      router.push(`/samples/${response.data.id}`)
    } catch(error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        errorMessage.value = '入力に不備があります。'
      }
    }
  }

  return {
    makerOptions,
    categoryOptions,
    name,
    color,
    hardness,
    feature,
    categoryId,
    makerId,
    filmThickness,
    summary,
    image,
    errorMessage,
    fetchMakerData,
    fetchCategories,
    sampleRegistration,
  }
}
