import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export interface Comment {
  id: number
  body: string
  commenter: string
  department: string
  sample_id: number
  user_id: number
}

export interface CommentsResponse {
  comment: Comment
  maker_id: number
}

export interface LoggedInResponse {
  payload: { user_id: number } | null
}

export interface Emit {
  (event: 'message', payload: { type: 'success' | 'danger'; text: string }): void
}

export function useCommentsShow(emit: Emit) {
  const router = useRouter()
  const comment = ref<Comment | null>(null)
  const sampleId = ref<number | null>(null)
  const makerId = ref<number | null>(null)
  const isAdmin = ref<boolean>(false)

  const fetchCommentData = async (id: string): Promise<void> => {
    const token = localStorage.getItem('token')
    const response = await axios.get<LoggedInResponse>(`${API_BASE_URL}/logged_in`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    isAdmin.value = response.data.payload?.user_id === 49

    try {
      const response = await axios.get<CommentsResponse>(`${API_BASE_URL}/comments/${id}`)
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

  return {
    router,
    comment,
    sampleId,
    makerId,
    isAdmin,
    fetchCommentData,
  }
}
