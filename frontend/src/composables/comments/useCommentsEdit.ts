import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export interface Comment {
  id: number
  commenter: string
  department: string
  body: string
  sample_id: number
  user_id: number
}

export interface CommentResponse {
  comment: Comment
  maker_id: number
}

export interface Emit {
  (event: 'message', payload: { type: 'success' | 'danger'; text: string }): void
}

export function useCommentsEdit(emit: Emit) {
  const router = useRouter()
  const comment = ref<Comment | null>(null)
  const sampleId = ref<number | null>(null)
  const makerId = ref<number | null>(null)
  const errorMessage = ref<string>('')

  const fetchCommentData = async (id: string): Promise<void> => {
    try {
      const response = await axios.get<CommentResponse>(
        `${API_BASE_URL}/comments/${id}`
      )
      comment.value = response.data.comment
      sampleId.value = comment.value.sample_id
      makerId.value = response.data.maker_id
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: 'コメント情報の取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  const commentUpdate = async (): Promise<void> => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}//makers/${makerId.value}/samples/${sampleId.value}/comments/${comment.value.id}`, {
        commenter: comment.value.commenter,
        department: comment.value.department,
        body: comment.value.body
      })
      comment.value = response.data
      emit('message', { type: 'success', text: 'コメント情報を更新しました。' })
      router.push(`/comments/${comment.value.id}`)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        errorMessage.value = '入力に不備があります。'
      }
    }
  }

  return {
    router,
    comment,
    sampleId,
    makerId,
    errorMessage,
    fetchCommentData,
    commentUpdate,
  }
}
