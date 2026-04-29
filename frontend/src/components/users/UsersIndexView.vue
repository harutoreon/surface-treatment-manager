<script setup>
import { onMounted, watch } from 'vue'
import { useUsers } from '@/composables/useUsers.js'

const emit = defineEmits(['message'])
const { route, users, currentPage, totalPages, fetchUserList, loggedIn } = useUsers(emit)

const getPageLink = (page) => ({
  path: route.path,
  query: { page }
})

watch(() => route.query.page, (newPage) => {
  currentPage.value = Number(newPage) || 1
  fetchUserList()
})

onMounted(async () => {
  if (await loggedIn) {
    await fetchUserList()
  }
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      ユーザーリスト
    </h3>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item">
        <div class="d-flex justify-content-between">
          <span>ユーザー名</span>
          <span>部署名</span>
        </div>        
      </div>

      <RouterLink
        v-for="user in users"
        :key="user.id"
        class="list-group-item list-group-item-action"
        :to="`/users/${user.id}`"
      >
        <div class="d-flex justify-content-between">
          <div>{{ user.name }}</div>
          <div>{{ user.department }}</div>
        </div>
      </RouterLink>
    </div>

    <ul v-if="totalPages > 0" class="pagination justify-content-center mb-5">
      <li class="page-item shadow-sm" :class="{ disabled: currentPage === 1 }">
        <RouterLink v-if="currentPage > 1" class="page-link" :to="getPageLink(currentPage - 1)">
          前ページ
        </RouterLink>
        <span v-else class="page-link">
          前ページ
        </span>
      </li>

      <li
        v-for="page in totalPages"
        :key="page"
        class="page-item shadow-sm"
        :class="{ active: page === currentPage }"
      >
        <RouterLink class="page-link" :to="getPageLink(page)">
          {{ page }}
        </RouterLink>
      </li>

      <li class="page-item shadow-sm" :class="{ disabled: currentPage === totalPages }">
        <RouterLink v-if="currentPage < totalPages" class="page-link" :to="getPageLink(currentPage + 1)">
          次ページ
        </RouterLink>
        <span v-else class="page-link">
          次ページ
        </span>
      </li>
    </ul>

    <ul class="nav justify-content-evenly">
      <li class="nav-item">
        <RouterLink to="/users/new">
          ユーザー情報の登録
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
