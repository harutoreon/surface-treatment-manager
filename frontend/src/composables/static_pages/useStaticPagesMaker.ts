import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export type MakerResponse = {
  id: number
  name: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useStaticPagesMaker() {
  const router = useRouter()
  const keyword = ref<string>('')
  const errorMessage = ref<string>('')
  const isOpen = ref<boolean>(false)
  const makers = ref<string[]>([])

  const fetchMakerList = async (): Promise<void> => {
    const response = await axios.get<MakerResponse[]>(`${API_BASE_URL}/maker_list`)
    makers.value = response.data.map(maker => maker.name)
  }

  const close = (): void => {
    window.setTimeout((): void => {
      isOpen.value = false
    }, 100)
  }

  const filteredList = computed(() => {
    if (!keyword.value) return []
    const word = keyword.value.toLowerCase()

    return makers.value.filter( maker =>
      maker.toLowerCase().includes(word)
    )
  })

  const select = (item): void => {
    keyword.value = item
    isOpen.value = false
  }

  const submitSearch = (): void => {
    errorMessage.value = ''

    if (!keyword.value) {
      errorMessage.value = 'キーワードが未入力です'
      return
    }
    router.push({
      name: 'SearchResults',
      params: { searchMethod: 'maker' },
      query: { keyword: keyword.value }
    })
  }

  return {
    keyword,
    errorMessage,
    isOpen,
    makers,
    fetchMakerList,
    close,
    filteredList,
    select,
    submitSearch,
  }
}
