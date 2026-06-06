<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { checkLoginStatus } from '@/components/utils.js'
import { useCommentsEdit } from '@/composables/comments/useCommentsEdit.ts'
import type { Emit } from '@/composables/comments/useCommentsEdit.ts'

const emit = defineEmits<Emit>()
const route = useRoute()

const {
  router,
  comment,
  errorMessage,
  fetchCommentData,
  commentUpdate,
} = useCommentsEdit(emit)

const cancel = (): void => {
  router.push(`/comments/${comment.value.id}`)
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
  <div class="container w-25">
    <h3 class="text-center m-5">
      コメント情報の編集
    </h3>

    <form v-if="comment" @submit.prevent="commentUpdate">
      <label class="form-label" for="department">
        部署名
      </label>
      <input
        id="department"
        v-model="comment.department"
        class="form-control mb-4 shadow-sm"
        type="text"
        disabled
      />
      
      <label class="form-label" for="commenter">
        投稿者
      </label>
      <input
        id="commenter"
        v-model="comment.commenter"
        class="form-control mb-4 shadow-sm"
        type="text"
        disabled
      />

      <label class="form-label" for="body">
        コメント
      </label>
      <textarea
        id="body"
        v-model="comment.body"
        class="form-control mb-5 shadow-sm"
      />

      <div class="d-grid gap-2 d-md-block">
        <button type="submit" class="btn btn-primary me-md-2 shadow">
          更新
        </button>
        <button
          v-if="comment.id"
          type="button"
          class="btn btn-outline-secondary shadow"
          @click="cancel"
        >
          キャンセル
        </button>
      </div>
    </form>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>
  </div>
</template>