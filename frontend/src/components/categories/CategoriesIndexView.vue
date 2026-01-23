<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const router = useRouter()
const categories = ref([])

function replaceStringWithEllipsis() {
  for (const category of categories.value) {
    if (category.summary.length > 10) {
      category.summary = category.summary.slice(0, 10) + '...'
    }
  }
}

const fetchCategoryList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`)
    categories.value = response.data
    replaceStringWithEllipsis()
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'カテゴリーの取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

onMounted(async () => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (!loggedIn) return
  await fetchCategoryList()
})
</script>

<template>
  <div class="container w-25">
    <p class="fs-3 text-center m-5">
      カテゴリーリスト
    </p>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <p class="fs-6 mb-1">
            カテゴリー名
          </p>
          <p class="fs-6 mb-1">
            概要
          </p>
        </div>
      </div>

      <RouterLink
        v-for="category in categories"
        :key="category.id"
        class="list-group-item list-group-item-action"
        :to="`/categories/${category.id}`"
      >
        <div class="d-flex w-100 justify-content-between">
          <p class="fs-6 mb-0">
            {{ category.item }}
          </p>
          <p class="fs-6 mb-0">
            {{ category.summary }}
          </p>
        </div>        
      </RouterLink>
    </div>

    <ul class="nav justify-content-evenly">
      <li class="nav-item">
        <RouterLink to="/categories/new">
          カテゴリー情報の登録
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/home">
          メインメニューへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
