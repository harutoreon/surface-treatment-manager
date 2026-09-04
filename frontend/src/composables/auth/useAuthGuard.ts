import { useRouter } from 'vue-router'
import { checkLoginStatus } from '@/components/utils'
import type { MessageEmit } from '@/env'

export const useAuthGuard = (emit: MessageEmit) => {
  const router = useRouter()

  const requireLogin = async (): Promise<boolean> => {
    return checkLoginStatus((): void => {
      emit('message', { type: 'danger', text: 'ログインが必要です。' })
      router.push('/')
    })
  }

  return { requireLogin }
}
