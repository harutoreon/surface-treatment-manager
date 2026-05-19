import { useRouter } from 'vue-router'
import { ref } from 'vue'
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

export function useSamplesDestroy(emit: Emit) {
  const router = useRouter()
  const sample = ref<Sample | null>(null)

  const handleDelete = async (): Promise<void> => {
    const confirmDelete = window.confirm('本当に削除しますか？')
    if (!confirmDelete) return

    try {
      await axios.delete(`${API_BASE_URL}/makers/${sample.value.maker_id}/samples/${sample.value.id}`)
      emit('message', { type: 'success', text: '表面処理情報を削除しました。' })
      router.push('/samples')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: '表面処理情報の削除処理に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  return {
    sample,
    handleDelete,
  }
}
