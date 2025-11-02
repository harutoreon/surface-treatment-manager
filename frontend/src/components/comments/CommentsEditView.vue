<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const route = useRoute()
const router = useRouter()
const comment = ref('')
const sampleId = ref('')
const errorMessage = ref('')

const fetchCommentData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/comments/${id}`)
    comment.value = response.data
    sampleId.value = comment.value.sample_id
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'コメント情報の取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const commentUpdate = async () => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/samples/${sampleId.value}/comments/${comment.value.id}`, {
      commenter: comment.value.commenter,
      department: comment.value.department,
      body: comment.value.body
    })
    comment.value = response.data
    emit('message', { type: 'success', text: 'コメント情報を更新しました。' })
    router.push(`/comments/${comment.value.id}`)
  } catch {
    errorMessage.value = '入力に不備があります。'
  }
}

onMounted(async () => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (!loggedIn) return
  await fetchCommentData(route.params.id)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      コメント情報の編集
    </h3>

    <form v-on:submit.prevent="commentUpdate">
      <label class="form-label" for="department">
        部署名
      </label>
      <input
        v-model="comment.department"
        class="form-control mb-4"
        type="text"
        id="department"
        disabled
      />
      
      <label class="form-label" for="commenter">
        投稿者
      </label>
      <input
        v-model="comment.commenter"
        class="form-control mb-4"
        type="text"
        id="commenter"
        disabled
      />

      <label class="form-label" for="body">
        コメント
      </label>
      <textarea v-model="comment.body" class="form-control mb-5" id="body">
      </textarea>
      
      <button type="submit" class="form-control btn btn-primary mb-5">
        更新
      </button>
    </form>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>

    <div class="d-flex justify-content-evenly">
      <RouterLink v-if="comment.id" v-bind:to="`/comments/${comment.id}`">
        コメント情報へ
      </RouterLink>
      <RouterLink to="/comments">
        コメントリストへ
      </RouterLink>
    </div>
  </div>
</template>