import { useRouter } from 'vue-router'

export function useSettings() {
  const router = useRouter()

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return { logout }
}
