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

export interface User {
  id: number
  name: string
  department: string
  admin: boolean
}

export interface Comment {
  comment: {
    id: number
    commenter: string
    body: string
    sample_id: number
    department: string
  },
  maker_id: number
}

export interface Emit {
  (event: 'message', payload: { type: 'success' | 'danger'; text: string }): void
}

export function useSamplesShow(emit: Emit) {
  const router = useRouter()
  const sampleComments = ref<Comment[]>([])
  const isAdmin = ref<boolean>(false)
  const sample = ref<Sample>({
    id: null,
    name: '',
    color: '',
    hardness: '',
    film_thickness: '',
    feature: '',
    summary: '',
    maker_id: null,
    category_id: null,
    image_url: '',
  })
  const user = ref<User>({
    id: null,
    name: '',
    department: '',
    admin: false,
  })

  const fetchSampleData = async (id: string): Promise<void> => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_BASE_URL}/logged_in`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const userResponse = await axios.get<User>(`${API_BASE_URL}/users/${response.data.payload.user_id}`)
    user.value = userResponse.data

    isAdmin.value = user.value.admin

    try {
      const response = await axios.get<Sample>(`${API_BASE_URL}/samples/${id}`)
      sample.value = response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: '表面処理情報の取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  const fetchSampleCommentsData = async (id: string): Promise<void> => {
    try {
      const response = await axios.get<Comment[]>(`${API_BASE_URL}/makers/${sample.value.maker_id}/samples/${id}/comments`)
      sampleComments.value = response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: 'コメントの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  return {
    sample,
    sampleComments,
    isAdmin,
    user,
    fetchSampleData,
    fetchSampleCommentsData,
  }
}
