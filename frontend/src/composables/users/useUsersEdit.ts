import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import type { MessageEmit } from '@/env'

export type UserResponse = {
  id: number
  name: string
  department: string
}

export type UpdateUserData  = {
  user: {
    name: string
    department: string
    password?: string
    password_confirmation?: string
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useUsersEdit(emit: MessageEmit) {
  const router = useRouter()
  const user = ref<UserResponse | null>(null)
  const password = ref<string>('')
  const passwordConfirmation = ref<string>('')
  const errorMessage = ref<string>('')

  const userUpdate = async (): Promise<void> => {
    if (!user.value.id) return
    errorMessage.value = ''

    try {
      // パスワードの変更がない場合に空の値が送信されないよう、パスワード入力はオプションとする。
      const updateData: UpdateUserData = {
        user: {
          name: user.value.name,
          department: user.value.department,
        }
      }

      if (password.value) {
        updateData.user.password = password.value
        updateData.user.password_confirmation = passwordConfirmation.value
      }

      const response = await axios.patch<UserResponse>(
        `${API_BASE_URL}/users/${user.value.id}`, updateData
      )
      emit('message', { type: 'success', text: 'ユーザー情報を更新しました。' })
      router.push(`/users/${response.data.id}`)
    } catch(error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        errorMessage.value = '入力に不備があります。'
      }
    }
  }

  return {
    user,
    password,
    passwordConfirmation,
    errorMessage,
    userUpdate,
  }
}
