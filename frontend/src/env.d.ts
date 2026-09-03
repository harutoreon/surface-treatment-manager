/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

export type MessageEmit = (
  event: 'message', payload: { type: 'danger', text: string }
) => void
