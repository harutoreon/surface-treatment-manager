<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { checkLoginStatus } from '@/components/utils.js'
import { useCommentsShow } from '@/composables/comments/useCommentsShow.ts'
import { useCommentsDestroy } from '@/composables/comments/useCommentsDestroy.ts'
import type { Emit } from '@/composables/comments/useCommentsShow.ts'

const emit = defineEmits<Emit>()
const route = useRoute()
const {
  router,
  comment,
  sampleId,
  makerId,
  isAdmin,
  fetchCommentData
} = useCommentsShow(emit)

const { handleDelete } = useCommentsDestroy(emit, makerId, sampleId, comment)

onMounted(async (): Promise<void> => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
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

    <div class="d-flex justify-content-end mt-5">
      <button
        v-show="isAdmin"
        class="btn btn-outline-danger shadow-sm"
        type="button"
        @click="handleDelete"
      >
        コメント情報の削除
      </button>
    </div>
  </div>
</template>
