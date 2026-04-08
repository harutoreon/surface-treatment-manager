import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

export function useSearchResults(emit) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const route = useRoute()
  const router = useRouter()
  const data = ref('')
  const samples = ref([])
  const searchMethod = ref('')

  const fetchSearchResults = async () => {
    const keyword = route.query.keyword
    searchMethod.value = route.params.searchMethod

    try {
      const response = await axios.get(`${API_BASE_URL}/${searchMethod.value}_search`, {
        params: { keyword: keyword }
      })
      data.value = response.data
      samples.value = data.value.samples
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

  return { loggedIn, data, samples, searchMethod, fetchSearchResults }
}
