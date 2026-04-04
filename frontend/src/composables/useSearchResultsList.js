import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

export function useSearchResultsList(emit) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const router = useRouter()
  const samples = ref([])

  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list_search`)
      samples.value = response.data
    } catch (error) {
      if (error.response && error.response.status === 404) {
        emit('message', { type: 'danger', text: 'サンプルの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  const loggedIn = checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })

  return { samples, loggedIn, fetchSearchResults }
}
