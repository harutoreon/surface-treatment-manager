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

interface MakerResponse {
  id: string
  name: string
  postal_code: string
  address: string
  phone_number: string
  fax_number: string
  email: string
  home_page: string
  manufacturer_rep: string
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
  const newMaker = ref<Maker>({
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

  // const maker = ref<MakerResponse | null>(null)

  const maker = ref<MakerResponse>({
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

  const name = ref<string>('')
  const postalCode = ref<string>('')
  const address = ref<string>('')
  const phoneNumber = ref<string>('')
  const faxNumber = ref<string>('')
  const email = ref<string>('')
  const homePage = ref<string>('')
  const manufacturerRep = ref<string>('')
  const errorMessage = ref<string>('')

  // index
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

  // show
  const fetchMakerData = async (id: string): Promise<void> => {
    try {
      const response = await axios.get<MakerResponse>(`${API_BASE_URL}/makers/${id}`)
      maker.value = response.data
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 404) {
        emit('message', { type: 'danger', text: 'メーカー情報の取得に失敗しました。' })
        router.replace({ name: 'NotFound' })
      }
    }
  }

  // new・create
  const makerRegistration = async (): Promise<void> => {
    try {
      const response = await axios.post<Maker>(`${API_BASE_URL}/makers`, {
        maker: {
          name: name.value,
          postal_code: postalCode.value,
          address: address.value,
          phone_number: phoneNumber.value,
          fax_number: faxNumber.value,
          email: email.value,
          home_page: homePage.value,
          manufacturer_rep: manufacturerRep.value
        }
      })
      newMaker.value = response.data
      emit('message', { type: 'success', text: 'メーカー情報を1件登録しました。' })
      router.push(`/makers/${newMaker.value.id}`)
    } catch(error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        errorMessage.value = '入力に不備があります。'
      }
    }
  }

  // edit・update
  const makerUpdate = async () => {
    try {
      const response = await axios.patch<MakerResponse>(`${API_BASE_URL}/makers/${maker.value.id}`, {
        name: maker.value.name,
        postal_code: maker.value.postal_code,
        address: maker.value.address,
        phone_number: maker.value.phone_number,
        fax_number: maker.value.fax_number,
        email: maker.value.email,
        home_page: maker.value.home_page,
        manufacturer_rep: maker.value.manufacturer_rep
      })
      maker.value = response.data
      emit('message', { type: 'success', text: 'メーカー情報を更新しました。' })
      router.push(`/makers/${maker.value.id}`)
    } catch(error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        errorMessage.value = '入力に不備があります。'
      }
    }
  }

  // destroy
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

  // login check
  const loggedIn = checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })

  return {
    router,
    route,
    maker,
    makers,
    currentPage,
    totalPages,
    name,
    postalCode,
    address,
    phoneNumber,
    faxNumber,
    email,
    homePage,
    manufacturerRep,
    errorMessage,
    fetchMakerList,
    fetchMakerData,
    makerRegistration,
    makerUpdate,
    handleDelete,
    loggedIn,
  }
}

