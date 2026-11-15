import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import App from '@/components/app/App.vue'
import type { MessagePayload } from '@/components/app/App.vue'
import type { VueWrapper } from '@vue/test-utils'

const {
  mockRoute,
  mockShow,
  mockDispose,
  mockGetOrCreateInstance,
  mockGetInstance
} = vi.hoisted(
  () => ({
    mockRoute: { path: '/home' },
    mockShow: vi.fn<() => void>(),
    mockDispose: vi.fn<() => void>(),
    mockGetOrCreateInstance: vi.fn<(el: Element, options?: { delay?: number }) => { show: () => void }>(),
    mockGetInstance: vi.fn<(el: Element) => { dispose: () => void } | null>(),
  }),
)

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
}))

vi.mock('bootstrap', () => ({
  Toast: {
    getOrCreateInstance: mockGetOrCreateInstance,
    getInstance: mockGetInstance,
  },
}))

const RouterViewStub = defineComponent({
  name: 'RouterViewStub',
  emits: {
    message: (_payload: MessagePayload) => true,
  },
  setup() {
    return () => h('div', { 'data-testid': 'router-view' })
  },
})

const mountComponent = () =>
  mount(App, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
        RouterView: RouterViewStub,
      },
    },
  })

describe('App.vue', (): void => {
  beforeEach((): void => {
    vi.resetAllMocks()
    mockGetOrCreateInstance.mockReturnValue({ show: mockShow })
    mockGetInstance.mockReturnValue(null)
  })

  describe('ヘッダー', (): void => {
    it('ルートが "/" のときはヘッダーを表示しない', (): void => {
      mockRoute.path = '/'

      const wrapper: VueWrapper = mountComponent()

      expect(wrapper.find('header').exists()).toBe(false)
    })

    it('"/" 以外のときはヘッダーを表示し、/home へのリンクを持つ', (): void => {
      mockRoute.path = '/home'

      const wrapper: VueWrapper = mountComponent()

      expect(wrapper.find('header').exists()).toBe(true)
      const link = wrapper.findComponent(RouterLinkStub)
      expect(link.props('to')).toBe('/home')
      expect(link.text()).toBe('Surface Treatment Manager')
    })
  })

  describe('初期表示', (): void => {
    it('Toast 要素は DOM に存在するが、本文は空で、まだ Bootstrap の Toast を生成しない', (): void => {
      const wrapper: VueWrapper = mountComponent()

      expect(wrapper.find('.toast').exists()).toBe(true)
      expect(wrapper.find('.toast-body').text()).toBe('')
      expect(mockGetOrCreateInstance).not.toHaveBeenCalled()
      expect(mockShow).not.toHaveBeenCalled()
    })

    it('メッセージ種別が空のときは text-bg-secondary を使う', (): void => {
      const wrapper: VueWrapper = mountComponent()

      expect(wrapper.find('.toast').classes()).toContain('text-bg-secondary')
    })

    it('閉じるボタンが Bootstrap の dismiss 属性とラベルを持つ', (): void => {
      const wrapper: VueWrapper = mountComponent()

      const closeButton = wrapper.find('button')
      expect(closeButton.attributes('data-bs-dismiss')).toBe('toast')
      expect(closeButton.attributes('aria-label')).toBe('通知を閉じる')
    })
  })

  describe('子ビューからの message イベント', (): void => {
    it('success のメッセージを受け取ると、本文と色クラスが更新される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()

      wrapper.findComponent(RouterViewStub).vm.$emit('message', {
        type: 'success',
        text: '保存が完了しました',
      })
      await flushPromises()

      expect(wrapper.find('.toast-body').text()).toBe('保存が完了しました')
      const classes = wrapper.find('.toast').classes()
      expect(classes).toContain('text-bg-success')
      expect(classes).not.toContain('text-bg-secondary')
    })

    it('danger のメッセージを受け取ると、text-bg-danger になる', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()

      wrapper.findComponent(RouterViewStub).vm.$emit('message', {
        type: 'danger',
        text: '保存に失敗しました',
      })
      await flushPromises()

      expect(wrapper.find('.toast').classes()).toContain('text-bg-danger')
    })

    it('Toast.getOrCreateInstance を Toast 要素と delay: 3000 で呼び、show() を1回呼ぶ', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()

      wrapper.findComponent(RouterViewStub).vm.$emit('message', {
        type: 'success',
        text: '保存が完了しました',
      })
      await flushPromises()

      expect(mockGetOrCreateInstance).toHaveBeenCalledTimes(1)
      expect(mockGetOrCreateInstance).toHaveBeenCalledWith(
        wrapper.find('.toast').element,
        { delay: 3000 },
      )
      expect(mockShow).toHaveBeenCalledTimes(1)
    })

    it('show() が呼ばれる時点で、本文と色クラスはすでに DOM に反映されている', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      let bodyAtShow = ''
      let classesAtShow = []
      mockShow.mockImplementation(() => {
        bodyAtShow = wrapper.find('.toast-body').text()
        classesAtShow = wrapper.find('.toast').classes()
      })

      wrapper.findComponent(RouterViewStub).vm.$emit('message', {
        type: 'warning',
        text: '入力内容を確認してください',
      })
      await flushPromises()

      expect(bodyAtShow).toBe('入力内容を確認してください')
      expect(classesAtShow).toContain('text-bg-warning')
    })

    it('続けて別のメッセージを受け取ると、本文と色が新しいものに置き換わる', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      const routerView = wrapper.findComponent(RouterViewStub)

      routerView.vm.$emit('message', { type: 'success', text: '1件目' })
      await flushPromises()
      routerView.vm.$emit('message', { type: 'danger', text: '2件目' })
      await flushPromises()

      expect(wrapper.find('.toast-body').text()).toBe('2件目')
      const classes = wrapper.find('.toast').classes()
      expect(classes).toContain('text-bg-danger')
      expect(classes).not.toContain('text-bg-success')
      expect(mockShow).toHaveBeenCalledTimes(2)
    })
  })

  describe('hidden.bs.toast イベント', (): void => {
    it('Toast が完全に隠れたら、本文と色がリセットされる', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      wrapper.findComponent(RouterViewStub).vm.$emit('message', {
        type: 'success',
        text: '保存が完了しました',
      })
      await flushPromises()
      const toast = wrapper.find('.toast')
      expect(toast.classes()).toContain('text-bg-success')

      toast.element.dispatchEvent(new Event('hidden.bs.toast'))
      await nextTick()

      expect(wrapper.find('.toast-body').text()).toBe('')
      expect(toast.classes()).toContain('text-bg-secondary')
      expect(toast.classes()).not.toContain('text-bg-success')
    })

    it('hide.bs.toast（非表示の開始）では、まだリセットされない', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      wrapper.findComponent(RouterViewStub).vm.$emit('message', {
        type: 'success',
        text: '保存が完了しました',
      })
      await flushPromises()

      wrapper.find('.toast').element.dispatchEvent(new Event('hide.bs.toast'))
      await nextTick()

      expect(wrapper.find('.toast-body').text()).toBe('保存が完了しました')
    })
  })

  describe('アンマウント時の後始末', (): void => {
    it('hidden.bs.toast のリスナーを解除する', (): void => {
      const wrapper: VueWrapper = mountComponent()
      const toastElement = wrapper.find('.toast').element
      const removeSpy = vi.spyOn(toastElement, 'removeEventListener')

      wrapper.unmount()

      expect(removeSpy).toHaveBeenCalledWith('hidden.bs.toast', expect.any(Function))
    })

    it('アンマウント後は hidden.bs.toast が発火しても状態を更新しない', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      const toastElement = wrapper.find('.toast').element

      wrapper.unmount()

      expect(() => toastElement.dispatchEvent(new Event('hidden.bs.toast'))).not.toThrow()
    })

    it('Toast インスタンスが存在すれば dispose() を呼ぶ', (): void => {
      mockGetInstance.mockReturnValue({ dispose: mockDispose })
      const wrapper: VueWrapper = mountComponent()
      const toastElement = wrapper.find('.toast').element

      wrapper.unmount()

      expect(mockGetInstance).toHaveBeenCalledWith(toastElement)
      expect(mockDispose).toHaveBeenCalledTimes(1)
    })

    it('Toast インスタンスが未作成（null）でもエラーにならない', (): void => {
      mockGetInstance.mockReturnValue(null)
      const wrapper: VueWrapper = mountComponent()

      expect(() => wrapper.unmount()).not.toThrow()
      expect(mockDispose).not.toHaveBeenCalled()
    })
  })
})