<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const router = useRouter()
const departmentOptions = ref('')
const sampleOptions = ref([])
const commenter = ref('')
const department = ref('')
const body = ref('')
const sampleName = ref('')
const sampleId = ref(null)
const comment = ref('')
const errorMessage = ref('')
const maker = ref('')
const makerOptions = ref('')
const makerId = ref(null)

const handleMakerChange = (event) => {
  const selected = makerOptions.value.find(
    option => option.name === event.target.value
  )
  makerId.value = selected?.id || null
}

const fetchMakerData = async () => {
  const response = await axios.get(`${API_BASE_URL}/maker_list`)
  makerOptions.value = response.data
}

const handleSampleChange = (event) => {
  const selected = sampleOptions.value.find(
    option => option.name === event.target.value
  )
  sampleId.value = selected?.id || null
}

const fetchDepartmentData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/departments`)
    departmentOptions.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: '部署リストの取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const fetchSampleData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/makers/${makerId.value}/samples`)
    sampleOptions.value = response.data.samples
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: '表面処理リストの取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

const commentRegistration = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/makers/${makerId.value}/samples/${sampleId.value}/comments`, {
      comment: {
        commenter: commenter.value,
        department: department.value,
        body: body.value
      }
    })
    comment.value = response.data
    emit('message', { type: 'success', text: 'コメント情報を1件登録しました。' })
    router.push(`/comments/${comment.value.id}`)
  } catch {
    errorMessage.value = '入力に不備があります。'
  }
}

watch(makerId, fetchSampleData)

onMounted(async () => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (!loggedIn) return
  await fetchDepartmentData()
  await fetchMakerData()
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      コメント情報の新規登録
    </h3>

    <p v-if="errorMessage" class="alert alert-danger mb-4" role="alert">
      {{ errorMessage }}
    </p>

    <form v-on:submit.prevent="commentRegistration">
      <label class="form-label" for="commenter">
        投稿者
      </label>
      <input
        v-model="commenter"
        class="form-control mb-4"
        type="text"
        id="commenter"
      />

      <label class="form-label" for="departments">
        部署名
      </label>
      <select v-model="department" class="form-select mb-4" id="departments">
        <option value="">
          部署名を選択して下さい
        </option>
        <option
          v-for="option in departmentOptions"
          v-bind:key="option.id"
          v-bind:value="option.name"
        >
          {{ option.name }}
        </option>
      </select>

      <label class="form-label" for="makers">
        メーカー
      </label>
      <select
        v-model="maker"
        v-on:change="handleMakerChange"
        class="form-select mb-4"
        id="makers"
      >
        <option value="">
          メーカーを選択して下さい
        </option>
        <option
          v-for="option in makerOptions"
          v-bind:key="option.id"
          v-bind:value="option.name"
        >
          {{ option.name }}
        </option>
      </select>

      <label v-if="makerId" class="form-label" for="samples">
        表面処理
      </label>
      <select
        v-if="makerId"
        v-model="sampleName"
        v-on:change="handleSampleChange"
        class="form-select mb-4"
        id="samples"
      >
        <option value="">
          表面処理を選択して下さい
        </option>
        <option
          v-for="option in sampleOptions"
          v-bind:key="option.id"
          v-bind:value="option.name"
        >
          {{ option.name }}
        </option>
      </select>

      <label class="form-label" for="body">
        コメント
      </label>
      <textarea v-model="body" class="form-control mb-5" id="body">
      </textarea>
      
      <button type="submit" class="form-control btn btn-primary mb-5">
        登録
      </button>
    </form>

    <ul class="nav justify-content-center">
      <li class="nav-item">
        <RouterLink to="/comments" class="d-flex justify-content-evenly">
          コメントリストへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
