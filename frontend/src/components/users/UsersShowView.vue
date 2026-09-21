<script setup lang="ts">
import { onMounted } from 'vue'
import { useUsersShow } from '@/composables/users/useUsersShow'
import { useUserComments } from '@/composables/users/useUserComments'
import { useAuthGuard } from '@/composables/auth/useAuthGuard'
import UsersDestroyView from '@/components/users/UsersDestroyView.vue'
import type { MessageEmit } from '@/env'
import { useRoute } from "vue-router";

const emit = defineEmits<MessageEmit>()
const route = useRoute()
const { user, fetchUserData } = useUsersShow(emit)
const { userComments, fetchUserComments } = useUserComments(emit)
const { requireLogin } = useAuthGuard(emit)

onMounted(async () => {
  const loggedIn = await requireLogin()
  if (loggedIn) {
    await fetchUserData(route.params.id as string)
    await fetchUserComments(route.params.id as string)
  }
})
</script>

<template>
  <div v-if="user" class="container w-25">
    <h3 class="text-center m-5">
      ユーザー情報
    </h3>

    <ul class="list-group mb-5 shadow-sm">
      <li class="d-flex justify-content-between list-group-item">
        <span>ユーザー名：</span>
        <div>{{ user.name }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>部署名：</span>
        <div>{{ user.department }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>コメント件数：</span>
        <div id="comment-count">
          {{ userComments.length }}
        </div>
      </li>
    </ul>

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

    <UsersDestroyView @message="emit('message', $event)" />
  </div>
</template>
