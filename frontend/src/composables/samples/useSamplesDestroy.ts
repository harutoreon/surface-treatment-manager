import { useRouter } from 'vue-router'
import axios from 'axios'
import type { Ref } from 'vue'
import type { Sample, Emit } from '@/composables/samples/useSamplesShow.ts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export function useSamplesDestroy(emit: Emit, sample: Ref<Sample | null>) {
  const router = useRouter()

  const handleDelete = async (): Promise<void> => {
    if (!sample.value) return
    
    const confirmDelete = window.confirm('本当に削除しますか？')
    if (!confirmDelete) return

    try {
      await axios.delete(
        `${API_BASE_URL}/makers/${sample.value.maker_id}/samples/${sample.value.id}`
      )
      emit('message', { type: 'success', text: '表面処理情報を削除しました。' })
      router.push('/samples')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: '表面処理情報の削除処理に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  return { handleDelete }
}
