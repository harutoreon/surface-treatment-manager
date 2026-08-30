import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useStaticPagesName() {
  const router = useRouter()
  const keyword = ref<string>('')
  const errorMessage = ref<string>('')

  const submitSearch = (): void => {
    errorMessage.value = ''

    const trimmedKeyword = keyword.value.trim()
    if (!trimmedKeyword) {
      errorMessage.value = 'キーワードが未入力です'
      return
    }

    router.push({
      name: 'SearchResults',
      params: { searchMethod: 'name' },
      query: { keyword: keyword.value }
    })
  }

  return { errorMessage, keyword, submitSearch }
}
