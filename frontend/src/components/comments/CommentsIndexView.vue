<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const router = useRouter()
const route = useRoute()
const comments = ref([])
const currentPage = ref(Number(route.query.page) || 1)
const totalPages = ref(1)

const formatDate = (isoString) => {
  const date = new Date(isoString)
  const [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  return `${year}/${month}/${day}`
}

const fetchCommentList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/comments?page=${currentPage.value}`)
    comments.value = response.data.comments
    currentPage.value = response.data.current_page
    totalPages.value = response.data.total_pages
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'コメントリストの取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const getPageLink = (page) => ({
  path: route.path,
  query: { page }
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const maxVisible = 10
  const half = Math.floor(maxVisible / 2)

  let start = Math.max(1, current - half)
  let end = Math.min(total, start + maxVisible - 1)

  // 終端で10個未満になる場合の調整
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  const pages = []
  for (let pageNumber = start; pageNumber <= end; pageNumber++) {
    pages.push(pageNumber)
  }
  return pages
})

watch(() => route.query.page, (newPage) => {
  currentPage.value = Number(newPage) || 1
  fetchCommentList()
})

onMounted(async () => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (!loggedIn) return
  await fetchCommentList()
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center mt-5 mb-5">
      コメントリスト
    </h3>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6>部署名 / 投稿者 / コメント</h6>
          <h6>投稿日</h6>
        </div>
      </div>

      <RouterLink
        v-for="comment in comments"
        v-bind:key="comment.id"
        class="list-group-item list-group-item-action"
        v-bind:to="`/comments/${comment.id}`"
      >
        <div class="d-flex justify-content-between">
          <h6>{{ comment.department }}：{{ comment.commenter }}</h6>
          <h6>{{ formatDate(comment.updated_at) }}</h6>
        </div>
        <div class="d-flex justify-content-between">
          <h6>{{ comment.body }}</h6>
        </div>
      </RouterLink>
    </div>

    <ul v-if="totalPages > 0"  class="pagination justify-content-center mb-5" id="pagination">
      <li class="page-item" :class="{ disabled: currentPage === 1 }" id="pagination_previous_page">
        <RouterLink class="page-link" v-if="currentPage > 1" v-bind:to="getPageLink(currentPage - 1)">
          前ページ
        </RouterLink>
        <span v-else class="page-link">
          前ページ
        </span>
      </li>

      <li
        v-for="page in visiblePages"
        v-bind:key="page"
        class="page-item"
        v-bind:class="{ active: page === currentPage }"
      >
        <RouterLink class="page-link" v-bind:to="getPageLink(page)">
          {{ page }}
        </RouterLink>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }" id="pagination_next_page">
        <RouterLink class="page-link" v-if="currentPage < totalPages" v-bind:to="getPageLink(currentPage + 1)">
          次ページ
        </RouterLink>
        <span v-else class="page-link">
          次ページ
        </span>
      </li>
    </ul>

    <div class="d-flex justify-content-evenly mb-5">
      <RouterLink to="/comments/new">
        コメントの新規登録へ
      </RouterLink>
      <RouterLink to="/home">
        メインメニューへ
      </RouterLink>
    </div>
  </div>
</template>
