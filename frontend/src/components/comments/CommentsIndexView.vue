<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import { checkLoginStatus } from '@/components/utils.js'
import { useCommentsIndex } from '@/composables/comments/useCommentsIndex.ts'
import type { Emit } from '@/composables/comments/useCommentsIndex.ts'

const emit = defineEmits<Emit>()
const {
  route,
  router,
  comments,
  currentPage,
  totalPages,
  fetchCommentList
} = useCommentsIndex(emit)

const formatDate = (isoString: string): string => {
  const date = new Date(isoString)
  const [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  return `${year}/${month}/${day}`
}

const getPageLink = (page: number): { path: string, query: { page: number} } => {
  return {
    path: route.path,
    query: { page }
  }
}

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

onMounted(async (): Promise<void> => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (loggedIn) await fetchCommentList()
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center m-5">
      コメントリスト
    </h3>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <span>部署名 / 投稿者 / コメント</span>
          <span>投稿日</span>
        </div>
      </div>

      <RouterLink
        v-for="comment in comments"
        :key="comment.id"
        class="list-group-item list-group-item-action"
        :to="`/comments/${comment.id}`"
      >
        <div class="d-flex justify-content-between">
          <div>{{ comment.department }}：{{ comment.commenter }}</div>
          <div>{{ formatDate(comment.updated_at) }}</div>
        </div>
        <div class="d-flex justify-content-between mt-2">
          <div>{{ comment.body }}</div>
        </div>
      </RouterLink>
    </div>

    <ul
      v-if="totalPages > 0"
      id="pagination"
      class="pagination justify-content-center mb-5"
    >
      <li
        id="pagination_previous_page"
        class="page-item shadow-sm"
        :class="{ disabled: currentPage === 1 }"
      >
        <RouterLink
          v-if="currentPage > 1"
          class="page-link"
          :to="getPageLink(currentPage - 1)"
        >
          前ページ
        </RouterLink>
        <span v-else class="page-link">
          前ページ
        </span>
      </li>

      <li
        v-for="page in visiblePages"
        :key="page"
        class="page-item shadow-sm"
        :class="{ active: page === currentPage }"
      >
        <RouterLink class="page-link" :to="getPageLink(page)">
          {{ page }}
        </RouterLink>
      </li>

      <li
        id="pagination_next_page"
        class="page-item shadow-sm"
        :class="{ disabled: currentPage === totalPages }"
      >
        <RouterLink
          v-if="currentPage < totalPages"
          class="page-link"
          :to="getPageLink(currentPage + 1)"
        >
          次ページ
        </RouterLink>
        <span v-else class="page-link">
          次ページ
        </span>
      </li>
    </ul>

    <ul class="nav justify-content-evenly mb-5">
      <li class="nav-item">
        <RouterLink to="/comments/new">
          コメントの新規登録へ
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
