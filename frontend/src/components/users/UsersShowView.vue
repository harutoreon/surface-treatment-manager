<script setup>
import { onMounted } from 'vue'
import { useUsers } from '@/composables/useUsers.js'

const emit = defineEmits(['message'])
const { route, user, fetchUserInformation, handleDelete, loggedIn } = useUsers(emit)

onMounted(async () => {
  if (await loggedIn) await fetchUserInformation(route.params.id)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      ユーザー情報
    </h3>

    <div class="list-group mb-5 shadow-sm">
      <li class="d-flex justify-content-between list-group-item">
        <span>ユーザー名：</span>
        <div>{{ user.name }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>部署名：</span>
        <div>{{ user.department }}</div>
      </li>
    </div>

    <ul class="nav justify-content-evenly">
      <li class="nav-item">
        <RouterLink v-if="user.id" :to="`/users/${user.id}/edit`">
          ユーザー情報の編集
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/users">
          ユーザーリスト
        </RouterLink>
      </li>
    </ul>

    <div class="d-flex justify-content-end mt-5">
      <button
        class="btn btn-outline-danger shadow-sm"
        type="button"
        @click="handleDelete"
      >
        ユーザーの削除
      </button>
    </div>
  </div>
</template>
