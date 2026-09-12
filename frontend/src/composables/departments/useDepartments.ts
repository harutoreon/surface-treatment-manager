import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { MessageEmit } from '@/env'
import axios from 'axios'

export type Department = {
  id: number
  name: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useDepartments(emit: MessageEmit) {
  const router = useRouter()
  const departments = ref<Department[]>([])
  const department = ref<Department | null>(null)
  const errorMessage = ref<string>('')
  const name = ref<string>('')

  // index
  const fetchDepartmentList = async (): Promise<void> => {
    try {
      const response = await axios.get<Department[]>(`${API_BASE_URL}/departments`)
      departments.value = response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: '部署リストの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  // show
  const fetchDepartmentData = async (id: string): Promise<void> => {
    try {
      const response = await axios.get<Department>(`${API_BASE_URL}/departments/${id}`)
      department.value = response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: '部署情報の取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  // new, create
  const departmentRegistration = async (): Promise<void> => {
    try {
      const response = await axios.post<Department>(`${API_BASE_URL}/departments`, {
        department: {
          name: name.value,
        }
      })
      department.value = response.data
      emit('message', { type: 'success', text: '部署を1件登録しました。' })
      router.push(`/departments/${department.value.id}`)
    } catch {
      errorMessage.value = '入力に不備があります。'
    }
  }

  // edit, update
  const departmentUpdate = async (): Promise<void> => {
    if (!department.value) return

    try {
      const response = await axios.patch<Department>(`${API_BASE_URL}/departments/${department.value.id}`, {
        name: department.value.name,
      })
      department.value = response.data
      emit('message', { type: 'success', text: '部署情報を更新しました。' })
      router.push(`/departments/${department.value.id}`)
    } catch {
      errorMessage.value = '入力に不備があります。'
    }
  }

  // destroy
  const handleDelete = async (): Promise<void> => {
    const confirmDelete: boolean = window.confirm('本当に削除しますか？')
    if (!confirmDelete) return

    if (!department.value) return

    try {
      await axios.delete<Department>(`${API_BASE_URL}/departments/${department.value.id}`)
      emit('message', { type: 'success', text: '部署情報を1件削除しました。' })
      router.push('/departments')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        emit('message', { type: 'danger', text: '削除処理に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  return {
    departments,
    department,
    errorMessage,
    name,
    fetchDepartmentList,
    fetchDepartmentData,
    handleDelete,
    departmentRegistration,
    departmentUpdate,
  }
}
