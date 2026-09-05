import HomeView from '@/components/static_pages/HomeView.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, RouterLinkStub, VueWrapper } from '@vue/test-utils'
import axios from 'axios'
import type { AxiosResponse } from 'axios'

type LoggedInResponse = { data: { payload: { user_id: number } } }

const { getItemMock, pushMock } = vi.hoisted(() => {
  return {
    getItemMock: vi.fn(),
    pushMock: vi.fn(),
  }
})

vi.mock('axios')
vi.mock('vue-router', () => {
  return {
    useRouter: () => {
      return {
        push: pushMock
      }
    }
  }
})
vi.stubGlobal('localStorage', {
  getItem: getItemMock
})

describe('HomeView', (): void => {
  const mountComponent = (): VueWrapper =>
    mount(HomeView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })

  const ADMIN_USER_ID: number = 49
  const GENERAL_USER_ID: number = 50

  const loginAs = (userId: number): void => {
    vi.mocked(getItemMock).mockReturnValue('test-token')
    vi.mocked(axios.get)
      .mockResolvedValueOnce({ status: 200 } as AxiosResponse)
      .mockResolvedValueOnce({ data: { payload: { user_id: userId } } } as LoggedInResponse)
  }

  beforeEach((): void => {
    vi.clearAllMocks()
  })

  describe('ユーザーの種類を問わずログインした場合', (): void => {
    beforeEach((): void => {
      loginAs(GENERAL_USER_ID)  // 代表で一般ユーザーでログインする
    })

    it('見出しが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.find('h3').text()).toBe('メインメニュー')
    })

    it('「アプリケーションの管理」カードが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const divManageSettings = wrapper.find('#manage-settings')
      const routerLink = divManageSettings.findComponent(RouterLinkStub)

      expect(divManageSettings.find('img').exists()).toBe(true)
      expect(divManageSettings.find('img').attributes('alt')).toBe('settings icon')
      expect(divManageSettings.find('div h5').text()).toBe('アプリケーションの管理')
      expect(divManageSettings.find('div div.card-text').text()).toBe('アプリケーションの設定やログアウトを行います。')
      expect(routerLink.props().to).toBe('/settings')
      expect(routerLink.text()).toBe('管理ページへ')
    })

    it('localStorage からトークンを取得する', async (): Promise<void> => {
      mountComponent()
      await flushPromises()

      expect(getItemMock).toHaveBeenCalledWith('token')
    })

    it('マウント時に handleLogin() が 1 回目に呼び出される', async (): Promise<void> => {
      mountComponent()
      await flushPromises()

      expect(axios.get).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('logged_in'),
        expect.objectContaining({ headers: { Authorization: 'Bearer test-token' } })
      )
    })

    it('マウント時に requireLogin() が 2 回目に呼び出される', async (): Promise<void> => {
      mountComponent()
      await flushPromises()

      expect(axios.get).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('logged_in'),
        expect.objectContaining({ headers: { Authorization: 'Bearer test-token' } })
      )
    })
  })

  describe('一般ユーザーでログインした場合', (): void => {
    beforeEach((): void => {
      loginAs(GENERAL_USER_ID)
    })

    it('「処理名で検索」カードが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const divSearchName = wrapper.find('#search-name')
      const routerLink = divSearchName.findComponent(RouterLinkStub)

      expect(divSearchName.find('img').exists()).toBe(true)
      expect(divSearchName.find('img').attributes('alt')).toBe('experiment icon')
      expect(divSearchName.find('div h5').text()).toBe('処理名で検索')
      expect(divSearchName.find('div div.card-text').text()).toBe('処理名を入力して表面処理を検索します。')
      expect(routerLink.props().to).toBe('/static_pages/name')
      expect(routerLink.text()).toBe('検索ページへ')
    })

    it('「カテゴリーで検索」カードが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const divSearchCategory = wrapper.find('#search-category')
      const routerLink = divSearchCategory.findComponent(RouterLinkStub)

      expect(divSearchCategory.find('img').exists()).toBe(true)
      expect(divSearchCategory.find('img').attributes('alt')).toBe('category icon')
      expect(divSearchCategory.find('div h5').text()).toBe('カテゴリーで検索')
      expect(divSearchCategory.find('div div.card-text').text()).toBe('カテゴリーを選択して表面処理を検索します。')
      expect(routerLink.props().to).toBe('/static_pages/category')
      expect(routerLink.text()).toBe('検索ページへ')
    })

    it('「メーカー名で検索」カードが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const divSearchMaker = wrapper.find('#search-maker')
      const routerLink = divSearchMaker.findComponent(RouterLinkStub)

      expect(divSearchMaker.find('img').exists()).toBe(true)
      expect(divSearchMaker.find('img').attributes('alt')).toBe('factory icon')
      expect(divSearchMaker.find('div h5').text()).toBe('メーカー名で検索')
      expect(divSearchMaker.find('div div.card-text').text()).toBe('メーカー名を入力して表面処理を検索します。')
      expect(routerLink.props().to).toBe('/static_pages/maker')
      expect(routerLink.text()).toBe('検索ページへ')
    })

    it('「処理一覧から検索」カードが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const divSearchList = wrapper.find('#search-list')
      const routerLink = divSearchList.findComponent(RouterLinkStub)

      expect(divSearchList.find('img').exists()).toBe(true)
      expect(divSearchList.find('img').attributes('alt')).toBe('list icon')
      expect(divSearchList.find('div h5').text()).toBe('処理一覧から検索')
      expect(divSearchList.find('div div.card-text').text()).toBe('表面処理一覧から目的の処理を検索します。')
      expect(routerLink.props().to).toBe('/list_search_results')
      expect(routerLink.text()).toBe('検索ページへ')
    })

    it('「変寸量で検索」カードが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const div = wrapper.find('#search-film-thickness')
      const routerLink = div.findComponent(RouterLinkStub)

      expect(div.find('img').exists()).toBe(true)
      expect(div.find('img').attributes('alt')).toBe('film-thickness icon')
      expect(div.find('div h5').text()).toBe('変寸量で検索')
      expect(div.find('div div.card-text').text()).toBe('変寸量を指定して目的の処理を検索します。')
      expect(routerLink.props().to).toBe('/static_pages/film_thickness')
      expect(routerLink.text()).toBe('検索ページへ')
    })
  })

  describe('管理者ユーザーでログインした場合', (): void => {
    beforeEach((): void => {
      loginAs(ADMIN_USER_ID)
    })

    it('「表面処理の管理」カードが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const divManageSamples = wrapper.find('#manage-samples')
      const routerLink = divManageSamples.findComponent(RouterLinkStub)

      expect(divManageSamples.find('img').exists()).toBe(true)
      expect(divManageSamples.find('img').attributes('alt')).toBe('library add icon')
      expect(divManageSamples.find('div h5').text()).toBe('表面処理の管理')
      expect(divManageSamples.find('div div.card-text').text()).toBe('表面処理に関する情報を一括管理します。')
      expect(routerLink.props().to).toBe('/samples')
      expect(routerLink.text()).toBe('管理ページへ')
    })

    it('「カテゴリーの管理」カードが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const divManageCategories = wrapper.find('#manage-categories')
      const routerLink = divManageCategories.findComponent(RouterLinkStub)

      expect(divManageCategories.find('img').exists()).toBe(true)
      expect(divManageCategories.find('img').attributes('alt')).toBe('category add icon')
      expect(divManageCategories.find('div h5').text()).toBe('カテゴリーの管理')
      expect(divManageCategories.find('div div.card-text').text()).toBe('カテゴリーに関する情報を一括管理します。')
      expect(routerLink.props().to).toBe('/categories')
      expect(routerLink.text()).toBe('管理ページへ')
    })

    it('「メーカーの管理」カードが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const divManageMakers = wrapper.find('#manage-makers')
      const routerLink = divManageMakers.findComponent(RouterLinkStub)

      expect(divManageMakers.find('img').exists()).toBe(true)
      expect(divManageMakers.find('img').attributes('alt')).toBe('maker add icon')
      expect(divManageMakers.find('div h5').text()).toBe('メーカーの管理')
      expect(divManageMakers.find('div div.card-text').text()).toBe('メーカーに関する情報を一括管理します。')
      expect(routerLink.props().to).toBe('/makers')
      expect(routerLink.text()).toBe('管理ページへ')
    })

    it('「ユーザーの管理」カードが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const divManageUsers = wrapper.find('#manage-users')
      const routerLink = divManageUsers.findComponent(RouterLinkStub)

      expect(divManageUsers.find('img').exists()).toBe(true)
      expect(divManageUsers.find('img').attributes('alt')).toBe('user add icon')
      expect(divManageUsers.find('div h5').text()).toBe('ユーザーの管理')
      expect(divManageUsers.find('div div.card-text').text()).toBe('ユーザーに関する情報を一括管理します。')
      expect(routerLink.props().to).toBe('/users')
      expect(routerLink.text()).toBe('管理ページへ')
    })

    it('「部署の管理」カードが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const divManageDepartments = wrapper.find('#manage-departments')
      const routerLink = divManageDepartments.findComponent(RouterLinkStub)

      expect(divManageDepartments.find('img').exists()).toBe(true)
      expect(divManageDepartments.find('img').attributes('alt')).toBe('department add icon')
      expect(divManageDepartments.find('div h5').text()).toBe('部署の管理')
      expect(divManageDepartments.find('div div.card-text').text()).toBe('部署に関する情報を一括管理します。')
      expect(routerLink.props().to).toBe('/departments')
      expect(routerLink.text()).toBe('管理ページへ')
    })

    it('「コメントの管理」カードが表示される', async (): Promise<void> => {
      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      const divManageComments = wrapper.find('#manage-comments')
      const routerLink = divManageComments.findComponent(RouterLinkStub)

      expect(divManageComments.find('img').exists()).toBe(true)
      expect(divManageComments.find('img').attributes('alt')).toBe('comment icon')
      expect(divManageComments.find('div h5').text()).toBe('コメントの管理')
      expect(divManageComments.find('div div.card-text').text()).toBe('コメントに関する情報を一括管理します。')
      expect(routerLink.props().to).toBe('/comments')
      expect(routerLink.text()).toBe('管理ページへ')
    })
  })

  describe('未ログイン状態でページをマウントした場合', (): void => {
    it('エラーメッセージ付きでログインページに遷移する', async (): Promise<void> => {
      vi.mocked(getItemMock).mockReturnValue(undefined)
      vi.mocked(axios.get).mockRejectedValueOnce({ response: { status: 401 } })
      vi.mocked(axios.isAxiosError).mockReturnValue(true)

      const wrapper: VueWrapper = mountComponent()
      await flushPromises()

      expect(wrapper.emitted('message')[0][0]).toEqual(
        expect.objectContaining({ text: 'ログインが必要です。', type: 'danger' })
      )
      expect(pushMock).toHaveBeenCalledWith('/')
    })
  })
})
