import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useStaticPagesMaker(emit) {
  const router = useRouter()
  const keyword = ref('')
  const errorMessage = ref('')
  const isOpen = ref(false)
  const makers = ref([])
  const makerList = ref([])
  const fetchMakerList = async () => {
    const response = await axios.get(`${API_BASE_URL}/maker_list`)
    makerList.value = response.data
    makers.value = makerList.value.map(maker => maker.name)
  }

  const close = () => {
    window.setTimeout(() => {
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

  const select = (item) => {
    keyword.value = item
    isOpen.value = false
  }

  const submitSearch = () => {
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

  const loggedIn = checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })

  return {
    keyword,
    errorMessage,
    isOpen,
    fetchMakerList,
    close,
    filteredList,
    select,
    submitSearch,
    loggedIn
  }
}
