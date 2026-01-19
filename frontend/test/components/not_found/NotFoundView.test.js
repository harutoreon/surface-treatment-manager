import NotFound from '@/components/not_found/NotFound.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

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

  describe('初期レンダリング', () => {
    beforeEach(async () => {
      wrapper = mount(NotFound)

      await flushPromises()
    })

    it('見出しが表示されること', () => {
      expect(wrapper.find('p.fs-1').text()).toBe('404')
    })

    it('404エラーメッセージが表示されること', () => {
      expect(wrapper.text()).toContain('お探しのページは見つかりませんでした。')
      expect(wrapper.text()).toContain('存在しない URL か、移動された可能性があります。')
    })

    it('ボタンが表示されること', () => {
      expect(wrapper.find('button').text()).toBe('ホームに戻る')
    })
  })

  describe('ボタンのクリックイベント', () => {
    it('「ホームに戻る」ボタンを押すと/homeが呼び出されること', async () => {
      await wrapper.find('button').trigger('click')

      expect(pushMock).toHaveBeenCalledWith('/home')
    })
  })
})