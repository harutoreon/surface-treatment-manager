import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import type { MessageEmit } from '@/env'


export type UserRequest = {
  id: number
  name: string
  department: string
  password: string
  password_confirmation: string
}

export type UserResponse = {
  id: number
  name: string
  department: string
}

export type DepartmentResponse = {
  id: number
  name: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useUsersNew(emit: MessageEmit) {
  const router = useRouter()
  const newUser = ref<UserResponse | null>(null)
  const name = ref<string>('')
  const department = ref<string>('')
  const password = ref<string>('')
  const passwordConfirmation = ref<string>('')
  const errorMessage = ref<string>('')
  const departmentOptions = ref<DepartmentResponse[]>([])

  const fetchDepartments = async (): Promise<void> => {
    try {
      const response = await axios.get<DepartmentResponse[]>(`${API_BASE_URL}/departments`)
      departmentOptions.value = response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: '部署名の取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  const userRegistration = async (): Promise<void> => {
    try {
      const response = await axios.post<UserRequest>(`${API_BASE_URL}/users`, {
        user: {
          name: name.value,
          department: department.value,
          password: password.value,
          password_confirmation: passwordConfirmation.value
        }
      })
      newUser.value = response.data
      emit('message', { type: 'success', text: 'ユーザー情報を登録しました。' })
      router.push(`/users/${newUser.value.id}`)
    } catch {
      errorMessage.value = '入力に不備があります。'
    }
  }

  return {
    newUser,
    name,
    department,
    password,
    passwordConfirmation,
    errorMessage,
    departmentOptions,
    fetchDepartments, userRegistration
  }
}
