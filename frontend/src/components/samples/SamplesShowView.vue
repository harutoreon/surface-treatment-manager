<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'
import { Modal } from 'bootstrap'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const route = useRoute()
const router = useRouter()
const sample = ref({
  id: '',
  name: '',
  category: '',
  color: '',
  maker: '',
  hardness: '',
  film_thickness: '',
  feature: '',
  image_url: ''
})

const sampleComments = ref([])
const isAdmin = ref(false)
const department = ref('')
const commenter = ref('')
const body = ref('')
const sampleId = ref(route.params.id)
const comment = ref('')
const errorMessage = ref('')

const handleCommentAdd = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/samples/${sampleId.value}/comments`, {
      comment: {
        commenter: commenter.value,
        department: department.value,
        body: body.value
      }
    })
    comment.value = response.data
    errorMessage.value = ''
    await fetchSampleCommentsData(route.params.id)

    const modal = Modal.getInstance('#commentPostForm')
    modal.hide()

    alert('コメントを1件追加しました。')
  } catch {
    errorMessage.value = 'コメントを入力して下さい。'
  }
}

const fetchSampleData = async (id) => {
  const token = localStorage.getItem('token')
  const response = await axios.get(`${API_BASE_URL}/logged_in`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  isAdmin.value = response.data.payload.user_id === 49

  try {
    const response = await axios.get(`${API_BASE_URL}/samples/${id}`)
    sample.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: '表面処理情報の取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const fetchSampleCommentsData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/samples/${id}/comments`)
    sampleComments.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'コメントの取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const formatDate = (isoString) => {
  const date = new Date(isoString)
  const [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  return `${year}/${month}/${day}`
}

const handleDelete = async () => {
  const confirmDelete = window.confirm('本当に削除しますか？')
  if (!confirmDelete) return

  try {
    await axios.delete(`${API_BASE_URL}/samples/${route.params.id}`)
    emit('message', { type: 'success', text: '表面処理情報を削除しました。' })
    router.push('/samples')
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: '表面処理情報の削除処理に失敗しました。' })
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
  await fetchSampleData(route.params.id)
  await fetchSampleCommentsData(route.params.id)
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center mt-5 mb-5">
      表面処理情報
    </h3>

    <div class="list-group mb-5">
      <li class="d-flex justify-content-between list-group-item">
        <div>処理名：</div>
        <div>{{ sample.name }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div>カテゴリー：</div>
        <div>{{ sample.category }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div>色調：</div>
        <div>{{ sample.color }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div>メーカー：</div>
        <div>{{ sample.maker }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div>硬度：</div>
        <div>{{ sample.hardness }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div>膜厚：</div>
        <div>{{ sample.film_thickness }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div>特徴：</div>
        <div>{{ sample.feature }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div>概要：</div>
        <div>{{ sample.summary }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div>画像：</div>
        <div>
          <img
            v-if="sample.image_url"
            v-bind:src="sample.image_url"
            alt="Sample Image"
            id="sample_image"
            style="width: 250px; height: auto;"
          />
          <div v-else>
            No Image
          </div>   
        </div>
      </li>
    </div>

    <h5 class="text-center mb-3">
      コメントリスト
    </h5>

    <div class="list-group list-group-flush mb-2">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6>部署名 / 投稿者 / コメント</h6>
          <h6>投稿日</h6>
        </div>
      </div>

      <div
        v-for="sampleComment in sampleComments"
        v-bind:key="sampleComment.id"
        class="list-group-item list-group-item-action"
        href="#"
      >
        <div class="d-flex w-100 justify-content-between">
          <h6>{{ sampleComment.department }}：{{ sampleComment.commenter }}</h6>
          <h6>{{ formatDate(sampleComment.created_at) }}</h6>
        </div>
        <div class="d-flex w-100 justify-content-between">
          <h6>{{ sampleComment.body }}</h6>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end mb-3">
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#commentPostForm"
      >
        コメントの新規作成
      </button>
    </div>

    <div
      class="modal fade"
      id="commentPostForm"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="commentPostFormLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1
              class="modal-title fs-5"
              id="commentPostFormLabel"
            >
              コメントの新規作成
            </h1>
          </div>
          <div class="modal-body">
            <input
              v-model="commenter"
              class="form-control mb-3"
              type="text"
              id="commenter"
            />
            <input
              v-model="department"
              class="form-control mb-3"
              type="text"
              id="department"
            />
            <textarea
              v-model="body"
              class="form-control"
              id="comment-post"
              placeholder="コメントはここに入力して下さい。"></textarea>
          </div>
          <div v-if="errorMessage" class="text-danger ms-3">
            {{ errorMessage }}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              閉じる
            </button>
            <button
              type="button"
              class="btn btn-primary"
              v-on:click="handleCommentAdd"
            >
              リストに追加
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-evenly mt-5 mb-5">
      <RouterLink v-if="sample.id" v-bind:to="`/samples/${sample.id}/edit`" ref="linkSamplesEdit">
        表面処理情報の編集
      </RouterLink>
      <p v-show="isAdmin" v-on:click="handleDelete" class="text-primary text-decoration-underline">
        表面処理情報の削除
      </p>
      <RouterLink to="/samples" ref="linkSamples">
        表面処理リストへ
      </RouterLink>
    </div>
  </div>
</template>

<style>
p {
  cursor: pointer;
}
</style>
