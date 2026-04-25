import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export function useDepartments(emit) {
  const route = useRoute()
  const router = useRouter()
  const departments = ref([])
  const department = ref('')
  const errorMessage = ref('')
  const name = ref('')

  // index
  const fetchDepartmentList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/departments`)
      departments.value = response.data
    } catch (error) {
      if (error.response && error.response.status === 404) {
        emit('message', { type: 'danger', text: '部署リストの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  // show
  const fetchDepartmentData = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/departments/${id}`)
      department.value = response.data
    } catch (error) {
      if (error.response && error.response.status === 404) {
        emit('message', { type: 'danger', text: '部署情報の取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  // new, create
  const departmentRegistration = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/departments`, {
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
  const departmentUpdate = async () => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/departments/${department.value.id}`, {
        name: department.value.name,
      })
      department.value = response.data
      emit('message', { type: 'success', text: '部署情報を更新しました。' })
      router.push(`/departments/${department.value.id}`)
    } catch {
      errorMessage.value = '入力に不備があります。'
    }
  }

  // delete
  const handleDelete = async () => {
    const confirmDelete = window.confirm('本当に削除しますか？')
    if (!confirmDelete) return

    try {
      await axios.delete(`${API_BASE_URL}/departments/${route.params.id}`)
      emit('message', { type: 'success', text: '部署情報を1件削除しました。' })
      router.push('/departments')
    } catch (error) {
      if (error.response && error.response.status === 404) {
        emit('message', { type: 'danger', text: '削除処理に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  // login check
  const loggedIn = checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })

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
    loggedIn,
  }
}
