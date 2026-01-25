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
const makerId = ref('')
const isAdmin = ref(false)

const fetchCommentData = async (id) => {
  const token = localStorage.getItem('token')
  const response = await axios.get(`${API_BASE_URL}/logged_in`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  isAdmin.value = response.data.payload?.user_id === 49

  try {
    const response = await axios.get(`${API_BASE_URL}/comments/${id}`)
    comment.value = response.data.comment
    sampleId.value = comment.value.sample_id
    makerId.value = response.data.maker_id
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
    <h3 class="text-center m-5">
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

    <ul class="nav justify-content-evenly">
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
        class="btn btn-outline-danger"
        type="button"
        @click="handleDelete"
      >
        コメント情報の削除
      </button>
    </div>
  </div>
</template>
