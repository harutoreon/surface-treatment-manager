<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const route = useRoute()
const sample = ref({
  id: '',
  name: '',
  category: '',
  color: '',
  maker: '',
  picture: '',
  hardness: '',
  film_thickness: '',
  feature: ''
})

const fetchSampleData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/samples/${id}`)
    sample.value = response.data
    console.log(sample.value)
  } catch (error) {
    console.error('Get sample data failed.')
  }
}

onMounted(() => {
  fetchSampleData(route.params.id)
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
        <div id="sample_picture">
          <img src="@/assets/images/electroless_nickel_plating.png" alt="sample image" class="mt-2 mb-2" width="250" height="250">
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

      <div class="list-group-item list-group-item-action" href="/samples/#">
        <div class="d-flex w-100 justify-content-between">
          <h6>品質管理部：テストユーザー</h6>
          <h6>2025/1/1</h6>
        </div>
        <div class="d-flex w-100 justify-content-between">
          <h6>表面の質感が滑らかで触感が良好です。</h6>
        </div>
      </div>

      <div class="list-group-item list-group-item-action" href="/samples/#">
        <div class="d-flex w-100 justify-content-between">
          <h6>品質管理部：テストユーザー</h6>
          <h6>2025/1/1</h6>
        </div>
        <div class="d-flex w-100 justify-content-between">
          <h6>表面の質感が滑らかで触感が良好です。</h6>
        </div>
      </div>

      <div class="list-group-item list-group-item-action" href="/samples/#">
        <div class="d-flex w-100 justify-content-between">
          <h6>品質管理部：テストユーザー</h6>
          <h6>2025/1/1</h6>
        </div>
        <div class="d-flex w-100 justify-content-between">
          <h6>表面の質感が滑らかで触感が良好です。</h6>
        </div>
      </div>

      <div class="list-group-item list-group-item-action" href="/samples/#">
        <div class="d-flex w-100 justify-content-between">
          <h6>品質管理部：テストユーザー</h6>
          <h6>2025/1/1</h6>
        </div>
        <div class="d-flex w-100 justify-content-between">
          <h6>表面の質感が滑らかで触感が良好です。</h6>
        </div>
      </div>

      <div class="list-group-item list-group-item-action" href="/samples/#">
        <div class="d-flex w-100 justify-content-between">
          <h6>品質管理部：テストユーザー</h6>
          <h6>2025/1/1</h6>
        </div>
        <div class="d-flex w-100 justify-content-between">
          <h6>表面の質感が滑らかで触感が良好です。</h6>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-evenly">
      <a href="#" id="link_sample_edit">表面処理情報の編集</a>
      <a href="#" id="link_sample_destroy">表面処理情報の削除</a>
      <a href="#" id="link_home">メインメニューへ</a>
    </div>
  </div>
</template>