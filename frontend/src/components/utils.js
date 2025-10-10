import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const checkLoginStatus = async (onUnauthorized) => {
  const token = localStorage.getItem('token')
  try {
    await axios.get(`${API_BASE_URL}/logged_in`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return true
  } catch (error) {
    if (error.response && error.response.status === 401) {
      if (onUnauthorized) onUnauthorized()
      return false
    }
  }
}