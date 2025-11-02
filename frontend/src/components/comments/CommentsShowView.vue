<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const router = useRouter()
const route = useRoute()
const comment = ref({})
const sampleId = ref('')

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

const handleDelete = async () => {
  const confirmDelete = window.confirm('本当に削除しますか？')
  if (!confirmDelete) return

  try {
    await axios.delete(`${API_BASE_URL}/samples/${sampleId.value}/comments/${route.params.id}`)
    emit('message', { type: 'success', text: 'コメント情報を1件削除しました。' })
    router.push('/comments')
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: '削除処理に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
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
  <div class="container w-50">
    <h3 class="text-center mt-5 mb-5">
      コメント情報
    </h3>

    <ul class="list-group mb-5">
      <li class="d-flex justify-content-between list-group-item">
        <div>部署名 :</div>
        <div>{{ comment.department }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div>投稿者 :</div>
        <div>{{ comment.commenter }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div>コメント :</div>
        <div>{{ comment.body }}</div>
      </li>
    </ul>

    <div class="d-flex justify-content-evenly">
      <RouterLink v-if="comment.id" v-bind:to="`/comments/${comment.id}/edit`">
        コメント情報の編集
      </RouterLink>
      <p v-on:click="handleDelete" class="text-primary text-decoration-underline">
        コメント情報の削除
      </p>
      <RouterLink to="/comments">
        コメントリストへ
      </RouterLink>
    </div>
  </div>
</template>
