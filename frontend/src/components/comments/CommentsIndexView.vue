<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const router = useRouter()
const comments = ref([])

const formatDate = (isoString) => {
  const date = new Date(isoString)
  const [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  return `${year}/${month}/${day}`
}

const fetchCommentList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/comment_list`)
    comments.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'コメントリストの取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

onMounted(() => {
  fetchCommentList()
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center mt-5 mb-5">
      コメントリスト
    </h3>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6>部署名 / 投稿者 / コメント</h6>
          <h6>投稿日</h6>
        </div>
      </div>

      <RouterLink
        v-for="comment in comments"
        v-bind:key="comment.id"
        class="list-group-item list-group-item-action"
        v-bind:to="`/samples/${comment.sample_id}/comments/${comment.id}`"
      >
        <div class="d-flex justify-content-between">
          <h6>{{ comment.department }}：{{ comment.commenter }}</h6>
          <h6>{{ formatDate(comment.updated_at) }}</h6>
        </div>
        <div class="d-flex justify-content-between">
          <h6>{{ comment.body }}</h6>
        </div>
      </RouterLink>
    </div>

    <div class="d-flex justify-content-evenly">
      <RouterLink to="/comments/new">
        コメントの新規登録へ
      </RouterLink>
      <RouterLink to="/home">
        メインメニューへ
      </RouterLink>
    </div>
  </div>
</template>
