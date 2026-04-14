import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import axios from 'axios'
import {useHome} from '@/composables/useHome.js'

vi.mock('axios')

describe('useHome', () => {
  describe('初期状態の検証', () => {
    it('isAdmin の初期値が false であること', () => {
      const {isAdmin} = useHome()
      expect(isAdmin.value).toBe(false)
    })

    it('containerSize の初期値が空文字であること', () => {
      const {containerSize} = useHome()
      expect(containerSize.value).toBe('')
    })
  })

  describe('ビジネスロジックの実行結果', () => {
    beforeEach(() => {
      localStorage.setItem('token', 'test-token')
    })

    afterEach(() => {
      localStorage.clear()
      vi.clearAllMocks()
    })

    describe('user_id が 49 の場合', () => {
      it('isAdmin が true になること', async () => {
        vi.mocked(axios).get.mockResolvedValue({
          data: {payload: {user_id: 49}}
        })

        const {isAdmin, handleLogin} = useHome()
        await handleLogin()

        expect(isAdmin.value).toBe(true)
      })

      it('containerSize が "container w-50" になること', async () => {
        vi.mocked(axios).get.mockResolvedValue({
          data: {payload: {user_id: 49}}
        })

        const {containerSize, handleLogin} = useHome()
        await handleLogin()

        expect(containerSize.value).toBe('container w-50')
      })
    })

    describe('user_id が 49 以外の場合', () => {
      it('isAdmin が false になること', async () => {
        vi.mocked(axios).get.mockResolvedValue({
          data: {payload: {user_id: 1}}
        })

        const {isAdmin, handleLogin} = useHome()
        await handleLogin()

        expect(isAdmin.value).toBe(false)
      })

      it('containerSize が "container w-75" になること', async () => {
        vi.mocked(axios).get.mockResolvedValue({
          data: {payload: {user_id: 1}}
        })

        const {containerSize, handleLogin} = useHome()
        await handleLogin()

        expect(containerSize.value).toBe('container w-75')
      })
    })
  })

  describe('外部通信のハンドリング', () => {
    beforeEach(() => {
      localStorage.setItem('token', 'test-token')
    })

    afterEach(() => {
      localStorage.clear()
      vi.clearAllMocks()
    })

    it('正しいエンドポイントに GET リクエストを送信すること', async () => {
      vi.mocked(axios).get.mockResolvedValue({
        data: {payload: {user_id: 1}}
      })

      const {handleLogin} = useHome()
      await handleLogin()

      expect(axios.get).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL}/logged_in`,
        expect.any(Object)
      )
    })

    it('Authorization ヘッダーに Bearer トークンを付与してリクエストを送信すること', async () => {
      vi.mocked(axios).get.mockResolvedValue({
        data: {payload: {user_id: 1}}
      })

      const {handleLogin} = useHome()
      await handleLogin()

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        {
          headers: {
            Authorization: 'Bearer test-token'
          }
        }
      )
    })

    it('GET リクエストを 1 回だけ送信すること', async () => {
      vi.mocked(axios).get.mockResolvedValue({
        data: {payload: {user_id: 1}}
      })

      const {handleLogin} = useHome()
      await handleLogin()

      expect(axios.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('引数による挙動の変化', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      localStorage.clear()
      vi.clearAllMocks()
    })

    describe('user_id が 49 の場合', () => {
      it('isAdmin が true になること', async () => {
        vi.mocked(axios).get.mockResolvedValue({
          data: {payload: {user_id: 49}}
        })

        const {isAdmin, handleLogin} = useHome()
        await handleLogin()

        expect(isAdmin.value).toBe(true)
      })
    })

    describe('user_id が 49 以外の場合', () => {
      it('isAdmin が false になること', async () => {
        vi.mocked(axios).get.mockResolvedValue({
          data: {payload: {user_id: 1}}
        })

        const {isAdmin, handleLogin} = useHome()
        await handleLogin()

        expect(isAdmin.value).toBe(false)
      })
    })
  })

  describe('副作用の実行', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      localStorage.clear()
    })

    afterEach(() => {
      vi.resetAllMocks()
    })

    it('handleLogin 実行時に localStorage から token を取得する', async () => {
      const getItemSpy = vi.spyOn(localStorage, 'getItem')
      localStorage.setItem('token', 'test-token-123')

      vi.mocked(axios).get.mockResolvedValue({
        data: {payload: {user_id: 1}}
      })

      const {handleLogin} = useHome()
      await handleLogin()

      expect(getItemSpy).toHaveBeenCalledWith('token')
      expect(getItemSpy).toHaveBeenCalledTimes(1)
    })

    it('localStorage に token が存在しない場合、null で API リクエストを送信する', async () => {
      vi.mocked(axios).get.mockResolvedValue({
        data: {payload: {user_id: 1}}
      })

      const {handleLogin} = useHome()
      await handleLogin()

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        {
          headers: {
            Authorization: 'Bearer null'
          }
        }
      )
    })
  })
})
