import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export interface Comment {
  id: number
  body: string
  commenter: string
  department: string
  sample_id: number
  user_id: number
  updated_at: string
}

export interface CommentsResponse {
  comments: Comment[]
  current_page: number
  total_pages: number
}

export interface Emit {
  (event: 'message', payload: { type: 'success' | 'danger'; text: string }): void
}

export function useCommentsIndex(emit: Emit){
  const route = useRoute()
  const router = useRouter()
  const comments = ref<Comment[]>([])
  const currentPage = ref<number>(Number(route.query.page) || 1)
  const totalPages = ref<number>(1)

  const fetchCommentList = async (): Promise<void> => {
    try {
      const response = await axios.get<CommentsResponse>(
        `${API_BASE_URL}/comments?page=${currentPage.value}`
      )
      comments.value = response.data.comments
      currentPage.value = response.data.current_page
      totalPages.value = response.data.total_pages
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: 'コメントリストの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  return {
    route,
    router,
    comments,
    currentPage,
    totalPages,
    fetchCommentList,
  }
}
