import { useRouter } from 'vue-router'
import axios from 'axios'
import type { Ref } from 'vue'
import type { Comment, Emit } from '@/composables/comments/useCommentsShow.ts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export function useCommentsDestroy(emit: Emit, makerId: Ref<number | null>, sampleId: Ref<number | null>, comment: Ref<Comment | null>) {
  const router = useRouter()

  const handleDelete = async (): Promise<void> => {
    if (!makerId || !sampleId || !comment) return

    const confirmDelete = window.confirm('本当に削除しますか？')
    if (!confirmDelete) return

    try {
      await axios.delete(
        `${API_BASE_URL}/makers/${makerId.value}/samples/${sampleId.value}/comments/${comment.value.id}`
      )
      emit('message', { type: 'success', text: 'コメント情報を1件削除しました。' })
      router.push('/comments')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: '削除処理に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  return { handleDelete }
}
