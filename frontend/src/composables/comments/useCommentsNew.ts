import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export interface User {
  id: number
  name: string
  department: string
  admin: boolean
}

export interface UserResponse {
  userId: number
  userName: string
  userDepartment: string
}

export interface Maker {
  id: number
  name: string
}

export interface Sample {
  id: number
  category_id: number
  color: string
  feature: string
  film_thickness: string
  hardness: string
  maker_id: number
  name: string
  summary: string
}

export interface SampleResponse {
  samples: Sample[]
  current_page: number
  total_pages: number
}

export interface Comment {
  id: number
  commenter: string
  department: string
  body: string
  sample_id: number
  user_id: number
}

export interface Emit {
  (event: 'message', payload: { type: 'success' | 'danger'; text: string }): void
}

export function useCommentsNew(emit: Emit) {
  const router = useRouter()
  const commenter = ref<string>('')
  const users = ref<UserResponse[]>([])
  const userId = ref<number | null>(null)
  const department = ref<string>('')
  const makerOptions = ref<Maker[]>([])
  const makerId = ref<number | null>(null)
  const sampleOptions = ref<Sample[]>([])
  const sampleId = ref<number | null>(null)
  const body = ref<string>('')
  const comment = ref<Comment | null>(null)
  const errorMessage = ref<string>('')

  const fetchUserList = async (): Promise<void> => {
    const response = await axios.get<User[]>(`${API_BASE_URL}/user_list`)
    const userList: User[] = response.data
    users.value = userList.map(user => ({
      userId: user.id,
      userName: user.name,
      userDepartment: user.department
    }))
  }

  const fetchMakerData = async (): Promise<void> => {
    const response = await axios.get<Maker[]>(`${API_BASE_URL}/maker_list`)
    makerOptions.value = response.data
  }

  const fetchSampleData = async (): Promise<void> => {
    try {
      const response = await axios.get<SampleResponse>(
        `${API_BASE_URL}/makers/${makerId.value}/samples`
      )
      sampleOptions.value = response.data.samples
    } catch (error) {
      if (error.response && error.response.status === 404) {
        emit('message', { type: 'danger', text: '表面処理リストの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  const commentRegistration = async (): Promise<void> => {
    try {
      const response = await axios.post<Comment>(
        `${API_BASE_URL}/makers/${makerId.value}/samples/${sampleId.value}/comments`, {
        comment: {
          commenter: commenter.value,
          department: department.value,
          body: body.value,
          user_id: userId.value
        }
      })
      comment.value = response.data
      emit('message', { type: 'success', text: 'コメント情報を1件登録しました。' })
      router.push(`/comments/${comment.value.id}`)
    } catch {
      errorMessage.value = '入力に不備があります。'
    }
  }

  return {
    users,
    makerOptions,
    sampleOptions,
    fetchUserList,
    fetchMakerData,
    fetchSampleData,
    commentRegistration,
  }
}
