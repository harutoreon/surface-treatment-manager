import MakersShowView from '@/components/makers/MakersShowView.vue'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import axios from 'axios'

const pushMock: ReturnType<typeof vi.fn> = vi.fn()
const replaceMock: ReturnType<typeof vi.fn> = vi.fn()

vi.mock('axios')
vi.mock('vue-router', async () => {
  return {
    useRoute: () => {
      return {
        params: { id: '1' },
        query: { page: 1 }
      }
    },
    useRouter: () => {
      return {
        push: pushMock,
        replace: replaceMock
      }
    }
  }
})

interface Maker {
  id: number
  name: string
  postal_code: string
  address: string
  phone_number: string
  fax_number: string
  email: string
  home_page: string
  manufacturer_rep: string
}

interface MessageEvent {
  type: 'danger' | 'success' | 'warning' | 'info'
  text: string
}

describe('MakersShowView', (): void => {
  const mockResponse: Maker = {
    id: 1,
    name: '有限会社中野銀行',
    postal_code: '962-0713',
    address: '東京都渋谷区神南1-2-0',
    phone_number: '070-3288-2552',
    fax_number: '070-2623-8399',
    email: 'sample_maker0@example.com',
    home_page: 'https://example.com/sample_maker0',
    manufacturer_rep: '宮本 悠斗'
  }

  const mountComponent  = () => mount(MakersShowView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期レンダリングに成功した場合', (): void => {
    it('メーカー情報ページが表示されること', async (): Promise<void> => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ data: mockResponse })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      // 見出し
      expect(wrapper.find('h3').text()).toBe('メーカー情報')

      // メーカー名
      expect(wrapper.text()).toContain('有限会社中野銀行')

      // 郵便番号
      expect(wrapper.text()).toContain('962-0713')

      // 住所
      expect(wrapper.text()).toContain('東京都渋谷区神南1-2-0')

      // 電話番号
      expect(wrapper.text()).toContain('070-3288-2552')

      // FAX番号
      expect(wrapper.text()).toContain('070-2623-8399')

      // Emailアドレス
      expect(wrapper.text()).toContain('sample_maker0@example.com')

      // ホームページアドレス
      expect(wrapper.text()).toContain('https://example.com/sample_maker0')

      // 担当者
      expect(wrapper.text()).toContain('宮本 悠斗')

      const routerLinks = wrapper.findAllComponents(RouterLinkStub)

      // to属性
      expect(routerLinks[0].props().to).toBe('/makers/1/edit')
      expect(routerLinks[1].props().to).toBe('/makers')

      // テキスト
      expect(routerLinks[0].text()).toBe('メーカー情報の編集へ')
      expect(routerLinks[1].text()).toBe('メーカーリストへ')

      // 削除ボタン
      expect(wrapper.find('button').text()).toBe('メーカー情報の削除')
    })
  })

  describe('初期レンダリングに失敗した場合', (): void => {
    it('404ページに遷移すること', async (): Promise<void>  => {
      vi.mocked(axios.get)
        .mockResolvedValueOnce({ status: 200 })
        .mockRejectedValueOnce({ response: { status: 404 } })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const emittedMessage = wrapper.emitted<MessageEvent>('message')
      expect(emittedMessage).toBeTruthy()
      expect(emittedMessage[0][0]).toEqual(
        { type: 'danger', text: 'メーカー情報の取得に失敗しました。' }
      )
      expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
    })
  })

  describe('メーカー情報の削除', (): void => {
    beforeEach((): void => {
      vi.stubGlobal('confirm', vi.fn(() => true))
    })

    afterEach((): void => {
      vi.unstubAllGlobals()
    })

    describe('成功した場合', (): void => {
      it('メーカーリストページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: mockResponse })

        vi.mocked(axios.delete).mockResolvedValueOnce({ status: 204 })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('button').trigger('click')

        const emittedMessage = wrapper.emitted<MessageEvent>('message')
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage[0][0]).toEqual(
          { type: 'success', text: 'メーカー情報を1件削除しました。' }
        )
        expect(pushMock).toHaveBeenCalledWith('/makers')
      })
    })

    describe('失敗した場合', (): void => {
      it('404ページに遷移すること', async (): Promise<void> => {
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ status: 200 })
          .mockResolvedValueOnce({ data: mockResponse })
        vi.mocked(axios.delete).mockRejectedValue({ response: { status: 404 } })

        const wrapper: VueWrapper = mountComponent()
        await flushPromises()

        await wrapper.find('button').trigger('click')

        const emittedMessage = wrapper.emitted<MessageEvent>('message')
        expect(emittedMessage).toBeTruthy()
        expect(emittedMessage[0][0]).toEqual(
          { type: 'danger', text: 'メーカー情報の削除処理に失敗しました。' }
        )
        expect(replaceMock).toHaveBeenCalledWith({ name: 'NotFound' })
      })
    })
  })
})
