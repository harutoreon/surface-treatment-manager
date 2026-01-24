<script setup>
import CardComponent from '@/components/static_pages/CardComponent.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import experimentIcon from '@/assets/icons/experiment.svg'
import categoryIcon from '@/assets/icons/category.svg'
import factoryIcon from '@/assets/icons/factory.svg'
import listIcon from '@/assets/icons/list.svg'
import libraryAddIcon from '@/assets/icons/library_add.svg'
import categoryAddIcon from '@/assets/icons/category_add.svg'
import makerAddIcon from '@/assets/icons/maker_add.svg'
import userAddIcon from '@/assets/icons/user_add.svg'
import settingsIcon from '@/assets/icons/settings.svg'
import department from '@/assets/icons/department.svg'
import commentIcon from '@/assets/icons/comment.svg'

defineEmits(['message'])

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const isAdmin = ref(false)
const containerSize = ref('')

onMounted(async () => {
  const token = localStorage.getItem('token')
  const response = await axios.get(`${API_BASE_URL}/logged_in`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  isAdmin.value = response.data.payload.user_id === 49
  containerSize.value = isAdmin.value ? 'container w-50' : 'container w-75'
})
</script>

<template>
  <div :class="containerSize">
    <h3 class="text-center m-5">
      メインメニュー
    </h3>

    <div v-if="!isAdmin">
      <div class="row mb-4">
        <div class="col ps-0 pe-0">
          <CardComponent
            id="search-name"
            alt="experiment icon"
            :icon="experimentIcon"
            card-title="処理名で検索"
            card-text="処理名を入力して表面処理を検索します。"
            to-attribute="/static_pages/name"
            link-text="検索ページへ"
          />
        </div>
        <div class="col ps-0 pe-0">
          <CardComponent
            id="search-category"
            alt="category icon"
            :icon="categoryIcon"
            card-title="カテゴリーで検索"
            card-text="カテゴリーを選択して表面処理を検索します。"
            to-attribute="/static_pages/category"
            link-text="検索ページへ"
          />
        </div>
        <div class="col ps-0 pe-0">
          <CardComponent
            id="search-maker"
            alt="factory icon"
            :icon="factoryIcon"
            card-title="メーカー名で検索"
            card-text="メーカー名を入力して表面処理を検索します。"
            to-attribute="/static_pages/maker"
            link-text="検索ページへ"
          />
        </div>
        <div class="col ps-0 pe-0">
          <CardComponent
            id="search-list"
            alt="list icon"
            :icon="listIcon"
            card-title="処理一覧から検索"
            card-text="表面処理一覧から目的の処理を検索します。"
            to-attribute="/list_search_results"
            link-text="検索ページへ"
          />
        </div>
      </div>
    </div>

    <div v-else>
      <div class="row mb-4">
        <div class="col ps-0 pe-0">
          <CardComponent
            id="manage-samples"
            alt="library add icon"
            :icon="libraryAddIcon"
            card-title="表面処理の管理"
            card-text="表面処理に関する情報を一括管理します。"
            to-attribute="/samples"
            link-text="管理ページへ"
          />
        </div>
        <div class="col ps-0 pe-0">
          <CardComponent
            id="manage-categories"
            alt="category add icon"
            :icon="categoryAddIcon"
            card-title="カテゴリーの管理"
            card-text="カテゴリーに関する情報を一括管理します。"
            to-attribute="/categories"
            link-text="管理ページへ"
          />
        </div>
        <div class="col ps-0 pe-0">
          <CardComponent
            id="manage-makers"
            alt="maker add icon"
            :icon="makerAddIcon"
            card-title="メーカーの管理"
            card-text="メーカーに関する情報を一括管理します。"
            to-attribute="/makers"
            link-text="管理ページへ"
          />
        </div>
      </div>

      <div class="row mb-4">
        <div class="col ps-0 pe-0">
          <CardComponent
            id="manage-users"
            alt="user add icon"
            :icon="userAddIcon"
            card-title="ユーザーの管理"
            card-text="ユーザーに関する情報を一括管理します。"
            to-attribute="/users"
            link-text="管理ページへ"
          />
        </div>
        <div class="col ps-0 pe-0">
          <CardComponent
            id="manage-departments"
            alt="department add icon"
            :icon="department"
            card-title="部署の管理"
            card-text="部署に関する情報を一括管理します。"
            to-attribute="/departments"
            link-text="管理ページへ"
          />
        </div>
        <div class="col ps-0 pe-0">
          <CardComponent
            id="manage-comments"
            alt="comment icon"
            :icon="commentIcon"
            card-title="コメントの管理"
            card-text="コメントに関する情報を一括管理します。"
            to-attribute="/comments"
            link-text="管理ページへ"
          />
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col ps-0 pe-0">
        <CardComponent
          id="manage-settings"
          alt="settings icon"
          :icon="settingsIcon"
          card-title="アプリケーションの管理"
          card-text="アプリケーションの設定やログアウトを行います。"
          to-attribute="/settings"
          link-text="管理ページへ"
        />
      </div>
    </div>
  </div>
</template>