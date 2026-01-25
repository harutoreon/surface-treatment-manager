<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { checkLoginStatus } from '@/components/utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const router = useRouter()
const samples = ref([])

const fetchSearchResults = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/list_search`)
    samples.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'サンプルの取得に失敗しました。' })
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
  await fetchSearchResults()
})
</script>

<template>
  <div class="container">
    <h3 class="text-center m-5">
      表面処理一覧
    </h3>

    <div class="album">
      <div class="row row-cols-5 g-3">
        <div v-for="sample in samples" :key="sample.id" class="col">
          <div class="card">
            <img
              :src="sample.image_url"
              class="card-img-top"
              alt="Sample Image"
              width="100%"
              height="225"
            />
            <div class="card-body">
              <div class="fs-5 card-title mb-3">
                {{ sample.name }}
              </div>
              <div class="card-text mb-3">
                {{ sample.summary }}
              </div>
              <RouterLink
                :to="`/samples/${sample.id}`"
                class="btn btn-primary"
              >
                詳細へ
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ul class="nav justify-content-center mt-5 mb-5">
      <li class="nav-item">
        <RouterLink to="/home">
          メインメニューへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
