import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useCategories(emit) {
  const route = useRoute()
  const router = useRouter()
  const item = ref('')
  const summary = ref('')
  const categories = ref([])
  const category = ref('')
  const errorMessage = ref('')

  // index
  function replaceStringWithEllipsis() {
    for (const category of categories.value) {
      if (category.summary.length > 10) {
        category.summary = category.summary.slice(0, 10) + '...'
      }
    }
  }

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`)
      categories.value = response.data
      replaceStringWithEllipsis()
    } catch (error) {
      if (error.response && error.response.status === 404) {
        emit('message', { type: 'danger', text: 'カテゴリーの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  // show
  const fetchCategoryData = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${id}`)
      category.value = { ...response.data }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        emit('message', { type: 'danger', text: 'カテゴリーの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  // new・create
  const categoryRegistration = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/categories`, {
        category: {
          item: item.value,
          summary: summary.value
        }
      })
      category.value = response.data
      emit('message', { type: 'success', text: 'カテゴリーを1件登録しました。' })
      router.push(`/categories/${category.value.id}`)
    } catch {
      errorMessage.value = '入力に不備があります。'
    }
  }

  // edit・update
  const categoryUpdate = async () => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/categories/${category.value.id}`, {
        item: category.value.item,
        summary: category.value.summary
      })
      category.value = { ...response.data }
      emit('message', { type: 'success', text: 'カテゴリー情報を更新しました。' })
      router.push(`/categories/${category.value.id}`)
    } catch {
      errorMessage.value = '入力に不備があります。'
    }
  }

  // delete
  const handleDelete = async () => {
    const confirmDelete = window.confirm('本当に削除しますか？')
    if (!confirmDelete) return

    try {
      await axios.delete(`${API_BASE_URL}/categories/${route.params.id}`)
      emit('message', { type: 'success', text: 'カテゴリーを1件削除しました。' })
      router.push('/categories')
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
    router,
    route,
    item,
    category,
    summary,
    errorMessage,
    categories,
    replaceStringWithEllipsis,
    fetchCategoryList,
    fetchCategoryData,
    handleDelete,
    categoryRegistration,
    categoryUpdate,
    loggedIn,
  }
}
