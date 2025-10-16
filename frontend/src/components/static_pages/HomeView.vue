<script setup>
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
import CardComponent from '@/components/static_pages/CardComponent.vue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const userId = ref('')
const userName = ref('')

onMounted(async () => {
  const token = localStorage.getItem('token')
  const response = await axios.get(`${API_BASE_URL}/logged_in`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  userId.value = response.data['payload']['user_id']  // シンボルに変更できるか？
  if (userId.value === 49) {  // 三項演算子で簡略化できるか？
    userName.value = 'admin user'
  } else {
    userName.value = 'general user'
  }
})
</script>

<template>
  <div class="container w-75">
    <h3 class="text-center mt-5 mb-5">
      メインメニュー
    </h3>

    <!-- 一般ユーザー専用カード -->

    <div v-if="userName === 'general user'" class="row mb-4">
      <div class="col ps-0 pe-0">
        <CardComponent
          id="search-name"
          alt="experiment icon"
          v-bind:icon="experimentIcon"
          cardTitle="処理名で検索"
          cardText="処理名を入力して表面処理を検索します。"
          toAttribute="/static_pages/name"
          linkText="検索ページへ"
        />
      </div>
      <div class="col ps-0 pe-0">
        <CardComponent
          id="search-category"
          alt="category icon"
          v-bind:icon="categoryIcon"
          cardTitle="カテゴリーで検索"
          cardText="カテゴリーを選択して表面処理を検索します。"
          toAttribute="/static_pages/category"
          linkText="検索ページへ"
        />
      </div>
      <div class="col ps-0 pe-0">
        <CardComponent
          id="search-maker"
          alt="factory icon"
          v-bind:icon="factoryIcon"
          cardTitle="メーカー名で検索"
          cardText="メーカー名を入力して表面処理を検索します。"
          toAttribute="/static_pages/maker"
          linkText="検索ページへ"
        />
      </div>
      <div class="col ps-0 pe-0">
        <CardComponent
          id="search-list"
          alt="list icon"
          v-bind:icon="listIcon"
          cardTitle="処理一覧から検索"
          cardText="表面処理一覧から目的の処理を検索します。"
          toAttribute="/list_search_results"
          linkText="検索ページへ"
        />
      </div>
    </div>

    <!-- 管理者ユーザー専用カード -->

    <div v-if="userName === 'admin user'" class="row mb-4">
      <div class="col ps-0 pe-0">
        <CardComponent
          id="manage-samples"
          alt="library add icon"
          v-bind:icon="libraryAddIcon"
          cardTitle="表面処理の管理"
          cardText="表面処理に関する情報を一括管理します。"
          toAttribute="/samples"
          linkText="管理ページへ"
        />
      </div>
      <div class="col ps-0 pe-0">
        <CardComponent
          id="manage-categories"
          alt="category add icon"
          v-bind:icon="categoryAddIcon"
          cardTitle="カテゴリーの管理"
          cardText="カテゴリーに関する情報を一括管理します。"
          toAttribute="/categories"
          linkText="管理ページへ"
        />
      </div>
      <div class="col ps-0 pe-0">
        <CardComponent
          id="manage-makers"
          alt="maker add icon"
          v-bind:icon="makerAddIcon"
          cardTitle="メーカーの管理"
          cardText="メーカーに関する情報を一括管理します。"
          toAttribute="/makers"
          linkText="管理ページへ"
        />
      </div>
    </div>

    <div v-if="userName === 'admin user'" class="row mb-4">
      <div class="col ps-0 pe-0">
        <CardComponent
          id="manage-users"
          alt="user add icon"
          v-bind:icon="userAddIcon"
          cardTitle="ユーザーの管理"
          cardText="ユーザーに関する情報を一括管理します。"
          toAttribute="/users"
          linkText="管理ページへ"
        />
      </div>
      <div class="col ps-0 pe-0">
        <CardComponent
          id="manage-departments"
          alt="department add icon"
          v-bind:icon="department"
          cardTitle="部署の管理"
          cardText="部署に関する情報を一括管理します。"
          toAttribute="/departments"
          linkText="管理ページへ"
        />
      </div>
      <div class="col ps-0 pe-0">
        <CardComponent
          id="manage-comments"
          alt="comment icon"
          v-bind:icon="commentIcon"
          cardTitle="コメントの管理"
          cardText="コメントに関する情報を一括管理します。"
          toAttribute="/comments"
          linkText="管理ページへ"
        />
      </div>
    </div>

    <!-- ユーザー共通カード -->

    <div class="row mb-4">
      <div class="col ps-0 pe-0">
        <CardComponent
          id="manage-settings"
          alt="settings icon"
          v-bind:icon="settingsIcon"
          cardTitle="アプリケーションの管理"
          cardText="アプリケーションの設定やログアウトを行います。"
          toAttribute="/settings"
          linkText="管理ページへ"/>
      </div>
    </div>
  </div>
</template>