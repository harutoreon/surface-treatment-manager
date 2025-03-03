import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import UsersEditView from '@/components/UsersEditView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/users/:id', component: UsersEditView }
  ],
})

vi.mock('axios')

const mockUser = {
  id: 1,
  name: 'test_user',
  department: 'test_department'
}

describe('コンポーネントのレンダリング', () => {
  let wrapper

  beforeEach(async () => {
    axios.get.mockResolvedValue({ data: mockUser })

    router.push('users/1')
    await router.isReady()

    wrapper = mount(UsersEditView, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a v-bind:href="to"><slot /></a>'
          }
        }
      }
    })

    await wrapper.vm.$nextTick()
  })

  it('フォームの各入力フィールドが正しく表示されている', () => {
    expect(wrapper.find('input#user_name').exists()).toBe(true)
    expect(wrapper.find('select#user_department').exists()).toBe(true)
    expect(wrapper.find('input#user_password').exists()).toBe(true)
    expect(wrapper.find('input#user_password_confirmation').exists()).toBe(true)
  })
})
