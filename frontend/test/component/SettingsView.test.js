import { mount } from '@vue/test-utils'
import SettingsView from '@/components/SettingsView.vue'
import { describe, it, expect, vi } from 'vitest'

const context = describe

describe('SettingsView.vue', () => {
  context('ログアウトの選択で OK を押した場合', () => {
    it('logou イベントが発火すること', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)
    
      const wrapper = mount(SettingsView)
      await wrapper.find('button').trigger('click')
      
      expect(wrapper.emitted('logout')).toBeTruthy()
    })
  })

  context('ログアウトの選択でキャンセルを押した場合', () => {
    it('logout イベントが発火しないこと', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false)
    
      const wrapper = mount(SettingsView)
      await wrapper.find('button').trigger('click')
      
      expect(wrapper.emitted('logout')).toBeFalsy()
    })
  })
})
