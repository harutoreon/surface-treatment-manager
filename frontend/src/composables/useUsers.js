import { ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useUsers(emit) {
  const route = useRoute()
  const router = useRouter()
  const users = ref([])
  const user = ref('')
  const currentPage = ref(Number(route.query.page) || 1)
  const totalPages = ref(1)
  const options = ref([])
  const name = ref('')
  const department = ref('')
  const password = ref('')
  const password_confirmation = ref('')
  const errorMessage = ref('')

  // index
  const fetchUserList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users?page=${currentPage.value}`)
      const data = response.data
      users.value = data.users
      currentPage.value = data.current_page
      totalPages.value = data.total_pages
    } catch (error) {
      if (error.response && error.response.status === 404) {
        emit('message', { type: 'danger', text: 'ユーザーリストの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  // show
  const fetchUserInformation = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${id}`)
      user.value = response.data
    } catch (error) {
      if (error.response && error.response.status === 404) {
        emit('message', { type: 'danger', text: 'ユーザー情報の取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  // new・create
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/departments`)
      options.value = response.data
    } catch (error) {
      if (error.response && error.response.status === 404) {
        emit('message', { type: 'danger', text: '部署名の取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  const userRegistration = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, {
        user: {
          name: name.value,
          department: department.value,
          password: password.value,
          password_confirmation: password_confirmation.value
        }
      })
      user.value = response.data
      emit('message', { type: 'success', text: 'ユーザー情報を登録しました。' })
      router.push(`/users/${user.value.id}`)
    } catch {
      errorMessage.value = '入力に不備があります。'
    }
  }

  // edit・update
  const userUpdate = async () => {
    try {
      // パスワードの変更がない場合に空の値が送信されないよう、パスワード入力はオプションとする。
      const updateData = {
        user: {
          name: user.value.name,
          department: user.value.department,
        }
      }

      if (password.value) {
        updateData.user.password = password.value
        updateData.user.password_confirmation = password_confirmation.value
      }

      const response = await axios.patch(`${API_BASE_URL}/users/${user.value.id}`, updateData)
      user.value = response.data
      emit('message', { type: 'success', text: 'ユーザー情報を更新しました。' })
      router.push(`/users/${user.value.id}`)
    } catch {
      errorMessage.value = '入力に不備があります。'
    }
  }

  // destroy
  const handleDelete = async () => {
    const confirmDelete = window.confirm('本当に削除しますか？')
    if (!confirmDelete) return

    try {
      await axios.delete(`${API_BASE_URL}/users/${route.params.id}`)
      emit('message', { type: 'success', text: 'ユーザー情報を削除しました。' })
      router.push('/users')
    } catch (error) {
      if (error.response && error.response.status === 404) {
        emit('message', { type: 'danger', text: 'ユーザー情報の削除に失敗しました。' })
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
    route,
    router,
    users,
    user,
    currentPage,
    totalPages,
    options,
    name,
    department,
    password,
    password_confirmation,
    errorMessage,
    fetchUserList,
    fetchUserInformation,
    fetchDepartments,
    userRegistration,
    userUpdate,
    handleDelete,
    loggedIn,
  }
}
