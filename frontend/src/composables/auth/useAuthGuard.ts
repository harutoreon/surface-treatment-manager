import { useRouter } from 'vue-router'
import { checkLoginStatus } from '@/components/utils.ts'

export const useAuthGuard = (emit) => {
  const router = useRouter()

  const requireLogin = async (): Promise<boolean> => {
    return checkLoginStatus(() => {
      emit('message', { type: 'danger', text: 'ログインが必要です。' })
      router.push('/')
    })
  }

  return { requireLogin }
}
