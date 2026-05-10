import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios, { AxiosError } from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

interface Maker {
  id: string
  address: string
  email: string
  fax_number: string
  home_page: string
  manufacturer_rep: string
  name: string
  phone_number: string
  postal_code: string
}

interface MakerListResponse {
  makers: Maker[]
  current_page: number
  total_pages: number
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export function useMakers(emit) {
  const route = useRoute()
  const router = useRouter()

  const makers = ref<Maker[]>([])
  const maker = ref<Maker>({
    id: '',
    name: '',
    postal_code: '',
    address: '',
    phone_number: '',
    fax_number: '',
    email: '',
    home_page: '',
    manufacturer_rep: ''
  })
  const currentPage = ref<number>(Number(route.query.page) || 1)
  const totalPages = ref<number>(1)

  const fetchMakerList = async (): Promise<void> => {
    try {
      const response = await axios.get<MakerListResponse>(
        `${API_BASE_URL}/makers?page=${currentPage.value}`
      )
      const data = response.data
      makers.value = data.makers
      currentPage.value = data.current_page
      totalPages.value = data.total_pages
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 404) {
        emit('message', { type: 'danger', text: 'メーカーリストの取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  const fetchMakerData = async (id: string): Promise<void> => {
    try {
      const response = await axios.get<Maker>(`${API_BASE_URL}/makers/${id}`)
      maker.value = response.data
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 404) {
        emit('message', { type: 'danger', text: 'メーカー情報の取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  const handleDelete = async (): Promise<void> => {
    const confirmDelete = window.confirm('本当に削除しますか？')
    if (!confirmDelete) return

    try {
      await axios.delete(`${API_BASE_URL}/makers/${route.params.id as string}`)
      emit('message', { type: 'success', text: 'メーカー情報を1件削除しました。' })
      router.push('/makers')
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 404) {
        emit('message', { type: 'danger', text: 'メーカー情報の削除処理に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  const loggedIn = checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })

  return {
    route,
    maker,
    makers,
    currentPage,
    totalPages,
    fetchMakerList,
    fetchMakerData,
    handleDelete,
    loggedIn,
  }
}

