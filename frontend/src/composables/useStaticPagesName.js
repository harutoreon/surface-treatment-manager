import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useStaticPagesName() {
  const router = useRouter()
  const keyword = ref('')
  const errorMessage = ref('')

  const submitSearch = () => {
    errorMessage.value = ''

    if (!keyword.value.trim()) {
      errorMessage.value = 'キーワードが未入力です'
      return
    }

    router.push({
      name: 'SearchResults',
      params: { searchMethod: 'name' },
      query: { keyword: keyword.value.trim() }
    })
  }

  return { errorMessage, keyword, submitSearch }
}
