<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const route = useRoute()
const router = useRouter()
const comment = ref('')

const fetchCommentData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/comments/${id}`)
    comment.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'コメント情報の取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

onMounted(() => {
  fetchCommentData(route.params.id)
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      コメント情報の編集
    </h3>

    <form>
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

      <label class="form-label" for="body">
        コメント
      </label>
      <textarea v-model="comment.body" class="form-control mb-5" id="body">
      </textarea>
      
      <button type="submit" class="form-control btn btn-primary mb-5">
        更新
      </button>
    </form>

    <div class="d-flex justify-content-evenly">
      <RouterLink v-bind:to="`/comments/${comment.id}`">
        コメント情報へ
      </RouterLink>
      <RouterLink to="/comments">
        コメントリストへ
      </RouterLink>
    </div>
  </div>
</template>