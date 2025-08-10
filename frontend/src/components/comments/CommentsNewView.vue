<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const emit = defineEmits(['message'])
const router = useRouter()
const departmentOptions = ref('')
const sampleOptions = ref('')

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
    const response = await axios.get(`${API_BASE_URL}/sample_list`)
    sampleOptions.value = response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: '表面処理リストの取得に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

onMounted(() => {
  fetchDepartmentData()
  fetchSampleData()
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      コメント情報の新規登録
    </h3>

    <form>
      <label class="form-label" for="commenter">
        投稿者
      </label>
      <input class="form-control mb-4" type="text" id="commenter"/>

      <label class="form-label" for="departments">
        部署名
      </label>
      <select class="form-select mb-4" id="departments">
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

      <label class="form-label" for="samples">
        表面処理
      </label>
      <select
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
      <textarea class="form-control mb-5" id="body">
      </textarea>
      
      <button type="submit" class="form-control btn btn-primary mb-5">
        登録
      </button>
    </form>

    <RouterLink to="/comments" class="d-flex justify-content-evenly">
      コメントリストへ
    </RouterLink>
  </div>
</template>
