<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

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
  picture: '',
  hardness: '',
  film_thickness: '',
  feature: '',
  image_url: ''
})

const sampleComments = ref([])

const fetchSampleData = async (id) => {
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
    router.push('/samples')
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emit('message', { type: 'danger', text: '表面処理情報の削除処理に失敗しました。' })
      router.replace({ name: 'NotFound' })
    }
  }
}

onMounted(() => {
  fetchSampleData(route.params.id)
  fetchSampleCommentsData(route.params.id)
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center mt-5 mb-5">表面処理情報</h3>

    <div class="list-group mb-5">
      <li class="d-flex justify-content-between list-group-item">
        <div id="label_sample_name">処理名：</div>
        <div id="sample_name">{{ sample.name }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div id="label_sample_category">カテゴリー：</div>
        <div id="sample_category">{{ sample.category }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div id="label_sample_color">色調：</div>
        <div id="sample_color">{{ sample.color }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div id="label_sample_maker">メーカー：</div>
        <div id="sample_maker">{{ sample.maker }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div id="label_sample_hardness">硬度：</div>
        <div id="sample_hardness">{{ sample.hardness }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div id="label_sample_film_thickness">膜厚：</div>
        <div id="sample_film_thickness">{{ sample.film_thickness }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div id="label_sample_feature">特徴：</div>
        <div id="sample_feature">{{ sample.feature }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div id="label_sample_picture">画像：</div>
        <div>
          <img
            v-if="sample.image_url"
            v-bind:src="sample.image_url"
            alt="Sample Image"
            id="sample_picture"
            style="width: 250px; height: auto;"
          />
          <div v-else>No Image</div>   
        </div>
      </li>
    </div>

    <h5 class="text-center mb-3">コメントリスト</h5>

    <div class="list-group list-group-flush mb-2">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6 id="label_commenter">部署名 / 投稿者 / コメント</h6>
          <h6 id="label_create_at">投稿日</h6>
        </div>
      </div>

      <div v-for="comment in sampleComments" v-bind:key="comment.id" class="list-group-item list-group-item-action" href="#">
        <div class="d-flex w-100 justify-content-between">
          <h6>{{ comment.department }}：{{ comment.commenter }}</h6>
          <h6>{{ formatDate(comment.created_at) }}</h6>
        </div>
        <div class="d-flex w-100 justify-content-between">
          <h6>{{ comment.body }}</h6>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-evenly mt-5 mb-5">
      <RouterLink v-bind:to="`/samples/${sample.id}/edit`" id="link_sample_edit">表面処理情報の編集</RouterLink>
      <p v-on:click="handleDelete" class="text-primary text-decoration-underline" id="link_sample_destroy">
        表面処理情報の削除
      </p>
      <RouterLink to="/home" id="link_home">メインメニューへ</RouterLink>
    </div>
  </div>
</template>

<style>
p {
  cursor: pointer;
}
</style>
