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

export interface Emit {
  (event: 'message', payload: { type: 'success' | 'danger'; text: string }): void
}

export function useUserComments(emit: Emit) {
  const router = useRouter()
  const userComments = ref<Comment[]>([])

  const fetchUserComments = async (id: string): Promise<void> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user_comment_count/user_id/${id}`)
      userComments.value = response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: 'コメントリストの取得に失敗しました。' })
        router.replace({name: 'NotFound'})
      }
    }
  }

  return { userComments, fetchUserComments }
}
