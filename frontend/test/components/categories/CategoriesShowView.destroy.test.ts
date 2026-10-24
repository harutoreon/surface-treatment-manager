import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { ref } from 'vue'
import CategoriesShowView from '@/components/categories/CategoriesShowView.vue'
import CategoriesDestroyView from '@/components/categories/CategoriesDestroyView.vue'
import type { VueWrapper } from '@vue/test-utils'
import type { Category } from '@/composables/categories/useCategoriesShow'
import type { Sample } from '@/composables/categories/useCategorySamples'

const {
  requireLoginMock,
  useCategoriesShowMock,
  fetchCategoryDataMock,
  useCategorySamplesMock,
  fetchCategorySamplesMock,
  handleDeleteMock,
  replaceMock,
} = vi.hoisted(() => {
  return {
    requireLoginMock: vi.fn(),
    useCategoriesShowMock: vi.fn(),
    fetchCategoryDataMock: vi.fn(),
    useCategorySamplesMock: vi.fn(),
    fetchCategorySamplesMock: vi.fn(),
    handleDeleteMock: vi.fn(),
    replaceMock: vi.fn(),
  }
})

vi.mock('vue-router', () => {
  return {
    useRoute: () => {
      return {
        params: { id: '1' },
      }
    },
    useRouter: () => {
      return {
        replace: replaceMock,
      }
    }
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
vi.mock('@/composables/categories/useCategoriesShow', () => {
  return {
    useCategoriesShow: useCategoriesShowMock,
  }
})
vi.mock('@/composables/categories/useCategorySamples', () => {
  return {
    useCategorySamples: useCategorySamplesMock,
  }
})
vi.mock('@/composables/categories/useCategoriesDestroy', () => {
  return {
    useCategoriesDestroy: () => {
      return {
        handleDelete: handleDeleteMock,
      }
    }
  }
})

describe('CategoriesShowViewDestroy', (): void => {
  const categoryMockResponse: Category = {
    id: 1,
    item: 'めっき',
    summary: '金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。'
  }

  const categorySamplesMockResponse: Sample[] = [
    {
      id: 1,
      name: '無電解ニッケルめっき',
      color: 'イエローブラウンシルバー',
      hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
      film_thickness: '5μm',
      feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
      summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
      maker_id: 1,
      category_id: 1,
    }
  ]

  const mountComponent = () => mount(CategoriesShowView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  beforeEach((): void => {
    vi.clearAllMocks()
    requireLoginMock.mockResolvedValue(true)
    useCategoriesShowMock.mockReturnValue({
      category: ref(categoryMockResponse),
      fetchCategoryData: fetchCategoryDataMock,
    })
    useCategorySamplesMock.mockReturnValue({
      categorySamples: ref(categorySamplesMockResponse),
      fetchCategorySamples: fetchCategorySamplesMock,
    })
  })

  describe('レンダリング条件', (): void => {
    it('カテゴリー情報が取得できていれば、子の削除コンポーネントが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.findComponent(CategoriesDestroyView).exists()).toBe(true)
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('カテゴリー情報が null の間は、削除コンポーネントは表示されない', async (): Promise<void> => {
      useCategoriesShowMock.mockReturnValue({
        category: ref(null),
        fetchCategoryData: fetchCategoryDataMock,
      })

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.findComponent(CategoriesDestroyView).exists()).toBe(false)
      expect(wrapper.find('button').exists()).toBe(false)
    })
  })

  describe('子から親への message イベントの中継', (): void => {
    it('マウント直後は message を emit していない', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.emitted('message')).toBeUndefined()
    })

    it('子が message を emit すると、親が同じ payload で再 emit する', async (): Promise<void>  => {
      const payload = { type: 'success', text: 'カテゴリーを1件削除しました。' }
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      wrapper.findComponent(CategoriesDestroyView).vm.$emit('message', payload)

      expect(wrapper.emitted('message')).toEqual([[payload]])
    })
  })

  describe('削除ボタンのクリックイベント', (): void => {
    it('親の画面上で削除ボタンを押すと、handleDelete が 1 回呼ばれる', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      await wrapper.find('button').trigger('click')

      expect(handleDeleteMock).toHaveBeenCalledTimes(1)
    })
  })
})