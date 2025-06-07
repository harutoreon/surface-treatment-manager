import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NotFound from '@/components/not_found/NotFound.vue'

const pushMock = vi.fn()

vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock
      }
    }
  }
})

describe('NotFound', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(NotFound)
  })

  describe('DOMの構造', () => {
    it('見出しが存在すること', () => {
      expect(wrapper.find('h1').exists()).toBe(true)
      expect(wrapper.find('h1').text()).toBe('404')
    })

    it('404エラーメッセージが存在すること', () => {
      expect(wrapper.find('#page-not-found').exists()).toBe(true)
      expect(wrapper.find('#page-not-found').text()).toBe('お探しのページは見つかりませんでした。')

      expect(wrapper.find('#url-missing-reason').exists()).toBe(true)
      expect(wrapper.find('#url-missing-reason').text()).toBe('存在しない URL か、移動された可能性があります。')
    })

    it('/homeに遷移するボタンが存在すること', () => {
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('button').text()).toBe('ホームに戻る')
    })
  })

  describe('クリックイベントの発火', () => {
    it('「ホームに戻る」ボタンを押すと/homeが呼び出されること', async () => {
      await wrapper.find('button').trigger('click')

      expect(pushMock).toHaveBeenCalledWith('/home')
      expect(pushMock).toHaveBeenCalledTimes(1)
    })
  })
})