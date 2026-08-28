import { useRouter } from 'vue-router'
import { checkLoginStatus } from '@/components/utils'

export type Emit = (event: 'message', payload: { type: 'success' | 'danger'; text: string }) => void

export const useAuthGuard = (emit: Emit) => {
  const router = useRouter()

  const requireLogin = async (): Promise<boolean> => {
    return checkLoginStatus((): void => {
      emit('message', { type: 'danger', text: 'ログインが必要です。' })
      router.push('/')
    })
  }

  return { requireLogin }
}
