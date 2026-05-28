<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'
import { Modal } from 'bootstrap'
import { useSamplesShow } from '@/composables/samples/useSamplesShow.ts'
import { useSamplesDestroy } from '@/composables/samples/useSamplesDestroy.ts'
import type { Emit } from '@/composables/samples/useSamplesShow.ts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
const emit = defineEmits<Emit>()

const {
  sample,
  sampleComments,
  isAdmin,
  user,
  fetchSampleData,
  fetchSampleCommentsData
} = useSamplesShow(emit)

const { handleDelete } = useSamplesDestroy(emit, sample)

const route = useRoute()
const router = useRouter()

const department = ref<string>('')
const commenter = ref<string>('')
const body = ref<string>('')
const sampleId = ref(route.params.id as string)
const errorMessage = ref<string>('')

const modalReset = (): void => {
  commenter.value = ''
  department.value = ''
  body.value = ''
  errorMessage.value = ''
}

const goBack = (): void => {
  router.back()
}

const handleCommentAdd = async (): Promise<void> => {
  try {
    await axios.post(
      `${API_BASE_URL}/makers/${sample.value.maker_id}/samples/${sampleId.value}/comments`, {
      comment: {
        commenter: commenter.value,
        department: department.value,
        body: body.value,
        user_id: user.value.id,
      }
    })
    errorMessage.value = ''
    await fetchSampleCommentsData(route.params.id as string)

    const modal = Modal.getInstance('#commentPostForm')
    modal.hide()

    alert('コメントを1件追加しました。')
  } catch(error) {
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      errorMessage.value = '入力に不備があります。'
    }
  }
}

const formatDate = (isoString: string): string => {
  const date = new Date(isoString)
  const [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  return `${year}/${month}/${day}`
}

onMounted(async (): Promise<void> => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (loggedIn) {
    await fetchSampleData(route.params.id as string)
    await fetchSampleCommentsData(sampleId.value)
  }
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center m-5">
      表面処理情報
    </h3>

    <div class="list-group mb-5 shadow-sm">
      <li class="d-flex justify-content-between list-group-item">
        <span>処理名：</span>
        <div>{{ sample.name }}</div>
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
            class="rounded-4 shadow"
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
        class="btn btn-primary shadow"
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
        <button
          v-show="!isAdmin"
          type="button"
          class="btn btn-link p-0 text-decoration-underline"
          @click="goBack"
        >
          検索結果に戻る
        </button>
      </li>
      <li class="nav-item">
        <RouterLink v-if="sample.id" :to="`/samples/${sample.id}/edit`" replace>
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
        id="handle-delete"
        class="btn btn-outline-danger shadow-sm"
        type="button"
        @click="handleDelete"
      >
        表面処理情報の削除
      </button>
    </div>
  </div>
</template>
