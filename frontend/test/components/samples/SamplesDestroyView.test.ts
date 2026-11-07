import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SamplesDestroyView from '@/components/samples/SamplesDestroyView.vue'
import type { Props } from '@/components/samples/SamplesDestroyView.vue'
import type { VueWrapper } from '@vue/test-utils'

const { handleDeleteMock, useSamplesDestroyMock } = vi.hoisted(() => {
  return {
    handleDeleteMock: vi.fn(),
    useSamplesDestroyMock: vi.fn(() => {
      return {
        handleDelete: handleDeleteMock,
      }
    })
  }
})

vi.mock('@/composables/samples/useSamplesDestroy', () => {
  return {
    useSamplesDestroy: useSamplesDestroyMock,
  }
})

describe('SamplesDestroyView', (): void => {
  const props: Props = {
    sample: {
      id: 1,
      name: '無電解ニッケルめっき',
      color: 'イエローブラウンシルバー',
      hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
      film_thickness: '5μm',
      feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
      summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
      maker_id: 1,
      category_id: 1,
      image_url: 'sample_image_url'
    }
  }

  const mountComponent = () => mount(SamplesDestroyView, {
    props
  })

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('初期レンダリング', (): void => {
    it('削除ボタンが表示される', (): void => {
      const wrapper: VueWrapper = mountComponent()
      const button = wrapper.find('button')

      expect(button.exists()).toBe(true)
      expect(button.text()).toBe('表面処理情報の削除')
    })

    it('マウント時点では削除処理は実行されない', (): void => {
      mountComponent()

      expect(handleDeleteMock).not.toHaveBeenCalled()
    })
  })

  describe('composable との連携', (): void => {
    it('useSamplesDestroy に emit が渡される', (): void => {
      mountComponent()

      expect(useSamplesDestroyMock).toHaveBeenCalledTimes(1)
      expect(useSamplesDestroyMock).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ value: props.sample })
      )
    })
  })

  describe('削除ボタンのクリックイベント', (): void => {
    it('クリックすると handleDelete が 1 回呼ばれる', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()

      await wrapper.find('button').trigger('click')

      expect(handleDeleteMock).toHaveBeenCalledTimes(1)
    })

    it('クリックのたびに handleDelete が呼ばれる', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      const button = wrapper.find('button')

      await button.trigger('click')
      await button.trigger('click')

      expect(handleDeleteMock).toHaveBeenCalledTimes(2)
    })
  })
})
