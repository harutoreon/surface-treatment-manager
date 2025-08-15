<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const router = useRouter()
const samplesWithImage = ref([])
const samplesWithoutImage = ref([])

const fetchSearchResults = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/list_search`)
    samplesWithoutImage.value = response.data
    
    for (const sample of samplesWithoutImage.value) {
      const response = await axios.get(`${API_BASE_URL}/samples/${sample.id}`)
      samplesWithImage.value.push(response.data)
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: 'サンプルの取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

onMounted(() => {
  fetchSearchResults()
})
</script>

<template>
  <div class="container">
    <h3 class="text-center mt-5 mb-5">
      表面処理一覧
    </h3>

    <div class="album">
      <div class="row row-cols-5 g-3">
        <div v-for="sample in samplesWithImage" v-bind:key="sample.id" class="col">
          <div class="card">
            <img
              v-bind:src="sample.image_url"
              class="card-img-top"
              alt="Sample Image"
              width="100%"
              height="225"
            >
            <div class="card-body">
              <h5 class="card-title mb-3">
                {{ sample.name }}
              </h5>
              <p class="card-text">
                {{ sample.summary }}
              </p>
              <RouterLink
                v-bind:to="`/samples/${sample.id}`"
                class="btn btn-primary"
              >
                詳細へ
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-evenly mt-5 mb-5">
      <RouterLink to="/home" ref="linkHome">
        メインメニューへ
      </RouterLink>
    </div>
  </div>
</template>