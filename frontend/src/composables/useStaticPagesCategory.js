import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useStaticPagesCategory(emit) {
  const router = useRouter()
  const keyword = ref('')
  const options = ref([])
  const errorMessage = ref('')

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`)
      options.value = response.data
    } catch (error) {
      if (error.response && error.response.status === 404) {
        emit('message', { type: 'danger', text: 'カテゴリーの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  const submitSearch = () => {
    errorMessage.value = ''

    if (!keyword.value) {
      errorMessage.value = 'リスト内の項目を選択して下さい'
      return
    }

    router.push({
      name: 'SearchResults',
      params: { searchMethod: 'category' },
      query: { keyword: keyword.value }
    })
  }

  const loggedIn = checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })

  return {
    errorMessage,
    keyword,
    options,
    fetchCategories,
    submitSearch,
    loggedIn
  }
}
