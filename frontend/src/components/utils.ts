import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type UnauthorizedCallback = () => void

export const checkLoginStatus = async (onUnauthorized?: UnauthorizedCallback): Promise<boolean>=> {
  const token = localStorage.getItem('token')
  try {
    await axios.get(`${API_BASE_URL}/logged_in`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return true
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      onUnauthorized?.()
      return false
    }
    return false
  }
}
