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

const modalReset = () => {
  commenter.value = ''
  department.value = ''
  body.value = ''
  errorMessage.value = ''
}

const handleCommentAdd = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/makers/${sample.value.maker_id}/samples/${sampleId.value}/comments`, {
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
    errorMessage.value = '入力に不備があります。'
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
    const response = await axios.get(`${API_BASE_URL}/makers/${sample.value.maker_id}/samples/${id}/comments`)
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
    await axios.delete(`${API_BASE_URL}/makers/${sample.value.maker_id}/samples/${sample.value.id}`)
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
    <h3 class="text-center m-5">
      表面処理情報
    </h3>

    <div class="list-group mb-5">
      <li class="d-flex justify-content-between list-group-item">
        <span>処理名：</span>
        <div>{{ sample.name }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>カテゴリー：</span>
        <div>{{ sample.category }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>色：</span>
        <div>{{ sample.color }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>硬度：</span>
        <div>{{ sample.hardness }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>膜厚：</span>
        <div>{{ sample.film_thickness }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>特徴：</span>
        <div>{{ sample.feature }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>概要：</span>
        <div>{{ sample.summary }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>画像：</span>
        <div>
          <img
            v-if="sample.image_url"
            id="sample_image"
            :src="sample.image_url"
            alt="Sample Image"
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

    <div class="d-flex justify-content-end mb-4">
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#commentPostForm"
        @click="modalReset"
      >
        コメントの新規作成
      </button>
    </div>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <span class="mb-1">部署名 / 投稿者 / コメント</span>
          <span class="mb-1">投稿日</span>
        </div>
      </div>

      <RouterLink
        v-for="sampleComment in sampleComments"
        :key="sampleComment.id"
        class="list-group-item list-group-item-action"
        :to="`/comments/${sampleComment.id}`"
      >
        <div class="d-flex w-100 justify-content-between">
          <div id="comment-department-commenter" class="mb-2">
            {{ sampleComment.department }}：{{ sampleComment.commenter }}
          </div>
          <div id="comment-created-at" class="mb-2">
            {{ formatDate(sampleComment.created_at) }}
          </div>
        </div>
        <div class="d-flex w-100 justify-content-between">
          <div id="comment-body">
            {{ sampleComment.body }}
          </div>
        </div>
      </RouterLink>
    </div>

    <div
      id="commentPostForm"
      class="modal fade"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="commentPostFormLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="commentPostFormLabel" class="modal-title">
              コメントの新規作成
            </h5>
          </div>
          <div class="modal-body">
            <div class="form-floating">
              <input
                id="commenter"
                v-model="commenter"
                class="form-control mb-3"
                type="text"
                placeholder="ここに氏名を入力して下さい。"
              />
              <label for="commenter">
                氏名
              </label>
            </div>
            <div class="form-floating">
              <input
                id="department"
                v-model="department"
                class="form-control mb-3"
                type="text"
                placeholder="ここに部署名を入力して下さい。"
              />
              <label for="department">
                部署名
              </label>
            </div>
            <div class="form-floating">
              <textarea
                id="comment-post"
                v-model="body"
                class="form-control"
                placeholder="コメントはここに入力して下さい。"
              />
              <label for="comment-post">
                コメント
              </label>
            </div>
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
              @click="handleCommentAdd"
            >
              リストに追加
            </button>
          </div>
        </div>
      </div>
    </div>

    <ul class="nav justify-content-evenly mb-5">
      <li class="nav-item">
        <RouterLink v-if="sample.id" :to="`/samples/${sample.id}/edit`">
          表面処理情報の編集
        </RouterLink>
      </li>
      <li v-show="isAdmin" class="nav-item">
        <RouterLink to="/samples">
          表面処理リストへ
        </RouterLink>
      </li>
    </ul>

    <div class="d-flex justify-content-end mb-5">
      <button
        v-show="isAdmin"
        class="btn btn-outline-danger"
        type="button"
        @click="handleDelete"
      >
        表面処理情報の削除
      </button>
    </div>
  </div>
</template>
