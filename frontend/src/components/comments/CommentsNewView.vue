<script setup>
import {ref, reactive, onMounted, watch, computed} from 'vue'
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
const isOpen = ref(false)
const users = reactive([])

const fetchUserList = async () => {
  const response = await axios.get(`${API_BASE_URL}/user_list`)
  const userList = response.data
  users.value = userList.map(user => reactive({
    userName: user.name,
    userDepartment: user.department
  }))
}

const close = () => {
  window.setTimeout(() => {
    isOpen.value = false
  }, 100)
}

const filteredList = computed(() => {
  if (!commenter.value) return []
  const word = commenter.value.toLowerCase()

  return users.value.filter( user =>
    user.userName.toLowerCase().includes(word)
  )
})

const select = (item) => {
  commenter.value = item
  department.value = users.value.filter(user => user.userName === item)[0].userDepartment
  isOpen.value = false
}

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
  await fetchUserList()
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      コメント情報の新規登録
    </h3>

    <p v-if="errorMessage" class="alert alert-danger mb-4" role="alert">
      {{ errorMessage }}
    </p>

    <form @submit.prevent="commentRegistration">
      <label class="form-label" for="commenter">
        投稿者
      </label>
      <div class="position-relative mb-4">
        <input
          v-model="commenter"
          type="text"
          class="form-control mb-3"
          placeholder="投稿者名の一部をここに入力して下さい"
          autocomplete="off"
          @focus="isOpen = true"
          @blur="close"
        />
        <ul
          v-if="isOpen && filteredList.length"
          class="list-group position-absolute w-100 shadow"
          style="z-index: 1000;"
        >
          <li
            v-for="item in filteredList"
            :key="item"
            class="list-group-item list-group-item-action text-start"
            @mousedown.prevent="select(item.userName)"
          >
            {{ item.userName }}
          </li>
        </ul>
      </div>

      <label class="form-label" for="departments">
        部署名
      </label>
      <input
        id="departments"
        v-model="department"
        class="form-control mb-4"
        type="text"
      />

      <label class="form-label" for="makers">
        メーカー
      </label>
      <select
        id="makers"
        v-model="maker"
        class="form-select mb-4"
        @change="handleMakerChange"
      >
        <option value="">
          メーカーを選択して下さい
        </option>
        <option
          v-for="option in makerOptions"
          :key="option.id"
          :value="option.name"
        >
          {{ option.name }}
        </option>
      </select>

      <label v-if="makerId" class="form-label" for="samples">
        表面処理
      </label>
      <select
        v-if="makerId"
        id="samples"
        v-model="sampleName"
        class="form-select mb-4"
        @change="handleSampleChange"
      >
        <option value="">
          表面処理を選択して下さい
        </option>
        <option
          v-for="option in sampleOptions"
          :key="option.id"
          :value="option.name"
        >
          {{ option.name }}
        </option>
      </select>

      <label class="form-label" for="body">
        コメント
      </label>
      <textarea id="body" v-model="body" class="form-control mb-5" />

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
