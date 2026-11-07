import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, RouterLinkStub, flushPromises } from '@vue/test-utils'
import SamplesShowView from '@/components/samples/SamplesShowView.vue'
import SamplesDestroyView from '@/components/samples/SamplesDestroyView.vue'
import type { VueWrapper } from '@vue/test-utils'
import type { Comment, Sample, User } from '@/composables/samples/useSamplesShow'
import axios from 'axios'

const {
  requireLoginMock,
  handleDeleteMock,
} = vi.hoisted(() => {
  return {
    requireLoginMock: vi.fn(),
    handleDeleteMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: '1' },
      }
    },
    useRouter: vi.fn()
  }
})
vi.mock('@/composables/auth/useAuthGuard', () => {
  return {
    useAuthGuard: () => {
      return {
        requireLogin: requireLoginMock,
      }
    }
  }
})
vi.mock('@/composables/samples/useSamplesDestroy', () => {
  return {
    useSamplesDestroy: () => {
      return {
        handleDelete: handleDeleteMock,
      }
    }
  }
})

describe('SamplesShowViewDestroy', (): void => {
  const sampleResponse: Sample = {
    id: 1,
    name: '無電解ニッケルめっき',
    color: 'イエローブラウンシルバー',
    hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
    film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
    feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
    summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
    maker_id: 1,
    category_id: 1,
    image_url: 'http://localhost:3000/rails/active_storage/blobs/sample_image_url.jpeg',
  }

  const commentResponse: Comment[] =[
    {
      id: 1,
      commenter: '岡本 陽子',
      body: '表面の質感が滑らかで、触感が良好です。',
      sample_id: 1,
      created_at: '2025-02-23T22:15:30.030Z',
      department: '営業部',
    }
  ]

  const adminUserResponse: User = {
    id: 49,
    name: 'admin user',
    department: '品質管理部',
    admin: true,
  }

  const generalUserResponse: User = {
    id: 50,
    name: 'general user',
    department: '開発部',
    admin: false,
  }

  const mountComponent = () => mount(SamplesShowView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      }
    }
  })

  const setupAxiosMocks = (user: 'adminUser' | 'generalUser'): void => {
    switch (user) {
      case 'adminUser':
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ data: { payload: { user_id: 49 } } })
          .mockResolvedValueOnce({ data: adminUserResponse })
        break
      case 'generalUser':
        vi.mocked(axios.get)
          .mockResolvedValueOnce({ data: { payload: { user_id: 50 } } })
          .mockResolvedValueOnce({ data: generalUserResponse })
        break
    }
    vi.mocked(axios.get)
      .mockResolvedValueOnce({ data: sampleResponse })
      .mockResolvedValueOnce({ data: commentResponse })
  }

  beforeEach((): void => {
    vi.resetAllMocks()
    requireLoginMock.mockResolvedValue(true)
  })

  describe('レンダリング条件', (): void => {
    it('管理者ユーザーのときは、削除ボタンが表示される', async (): Promise<void> => {
      setupAxiosMocks('adminUser')

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const targetComponent = wrapper.findComponent(SamplesDestroyView)

      expect(targetComponent.exists()).toBe(true)
      expect(targetComponent.find('button').exists()).toBe(true)
    })

    it('一般ユーザーのときは、削除ボタンは表示されない', async (): Promise<void> => {
      setupAxiosMocks('generalUser')

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.findComponent(SamplesDestroyView).exists()).toBe(false)
    })
  })

  describe('子から親への message イベントの中継', (): void => {
    it('マウント直後は message を emit していない', async (): Promise<void> => {
      setupAxiosMocks('adminUser')

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.emitted('message')).toBeUndefined()
    })

    it('子が message を emit すると、親が同じ payload で再 emit する', async (): Promise<void> => {
      setupAxiosMocks('adminUser')

      const payload = { type: 'success', text: '表面処理情報を削除しました。' }

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      wrapper.findComponent(SamplesDestroyView).vm.$emit('message', payload)

      expect(wrapper.emitted('message')).toEqual([[payload]])
    })
  })

  describe('削除ボタンのクリックイベント', (): void => {
    it('親の画面上で削除ボタンを押すと、handleDelete が 1 回呼ばれる', async (): Promise<void> => {
      setupAxiosMocks('adminUser')

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      await wrapper.findComponent(SamplesDestroyView).find('button').trigger('click')

      expect(handleDeleteMock).toHaveBeenCalledTimes(1)
    })
  })
})
