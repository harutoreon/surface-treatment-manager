<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCommentsShow } from '@/composables/comments/useCommentsShow'
import { useAuthGuard } from '@/composables/auth/useAuthGuard'
import CommentsDestroyView from '@/components/comments/CommentsDestroyView.vue'
import type { MessageEmit } from '@/env'

const emit = defineEmits<MessageEmit>()
const route = useRoute()
const { requireLogin } = useAuthGuard(emit)
const {
  comment,
  sampleId,
  makerId,
  isAdmin,
  fetchCommentData
} = useCommentsShow(emit)

onMounted(async (): Promise<void> => {
  const loggedIn = await requireLogin()
  if (loggedIn) await fetchCommentData(route.params.id as string)
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center m-5">
      コメント情報
    </h3>

    <ul v-if="comment" class="list-group mb-5 shadow-sm">
      <li class="d-flex justify-content-between list-group-item">
        <span>部署名 :</span>
        <div>{{ comment.department }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>投稿者 :</span>
        <div>{{ comment.commenter }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>コメント :</span>
        <div>{{ comment.body }}</div>
      </li>
    </ul>

    <ul v-if="comment" class="nav justify-content-evenly">
      <li class="nav-item">
        <RouterLink v-if="comment.id" :to="`/comments/${comment.id}/edit`">
          コメント情報の編集
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink v-show="isAdmin" to="/comments">
          コメントリストへ
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink v-if="sampleId" :to="`/samples/${sampleId}`">
          表面処理情報へ
        </RouterLink>
      </li>
    </ul>

    <CommentsDestroyView
      :maker-id="makerId"
      :sample-id="sampleId"
      :comment="comment"
      :is-admin="isAdmin"
      @message="emit('message', $event)"
    />
  </div>
</template>
