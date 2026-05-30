<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'
import { useCommentsShow } from '@/composables/comments/useCommentsShow.ts'
import type { Emit } from '@/composables/comments/useCommentsShow.ts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
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

const handleDelete = async () => {
  const confirmDelete = window.confirm('本当に削除しますか？')
  if (!confirmDelete) return

  try {
    await axios.delete(`${API_BASE_URL}/makers/${makerId.value}/samples/${sampleId.value}/comments/${comment.value.id}`)
    emit('message', { type: 'success', text: 'コメント情報を1件削除しました。' })
    router.push('/comments')
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: '削除処理に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

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
