<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { checkLoginStatus } from '@/components/utils.js'
import { useRouter } from 'vue-router'

const emit = defineEmits(['message'])
const router = useRouter()
const minFilmThickness = ref(3)
const maxFilmThickness = ref(7)

const samples = reactive([
  {
    id: 1,
    name: '無電解ニッケルめっき',
    film_thickness: '5μm',
    feature: '耐食性・耐摩耗性・耐薬品性・耐熱性',
    color: 'イエローブラウンシルバー',
  },
])

const searchResultMessage = computed(() => {
  return `${ minFilmThickness.value } μm から ${ maxFilmThickness.value } μm の範囲で ${ samples.length } 件該当`
})

onMounted(async () => {
  await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center m-5">
      表面処理の検索結果
    </h3>

    <div class="fs-5 text-center mb-5">
      {{ searchResultMessage }}
    </div>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item">
        <div class="d-flex w-100 justify-content-between">
          <div class="fs-6 mb-1">
            処理名 / 膜厚
          </div>
          <div class="fs-6 mb-1">
            主な機能 / 色
          </div>
        </div>
      </div>
      <RouterLink
        v-for="sample in samples"
        :key="sample.id"
        :to="`/samples/${sample.id}`"
        class="list-group-item list-group-item-action"
      >
        <div class="d-flex justify-content-between">
          <div class="fs-6 mb-2">
            {{ sample.name }}
          </div>
          <div class="fs-6 mb-2">
            {{ sample.feature }}
          </div>
        </div>
        <div class="d-flex justify-content-between">
          <div class="fs-6 mb-1">
            {{ sample.film_thickness }}
          </div>
          <div class="fs-6 mb-1">
            {{ sample.color }}
          </div>
        </div>
      </RouterLink>
      <div v-if="samples.length === 0" class="fs-4 text-center m-5">
        該当する表面処理はありませんでした。
      </div>
    </div>

    <ul class="nav justify-content-evenly mb-5">
      <li class="nav-item">
        <RouterLink to="/static_pages/film_thickness">
          再検索
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/home">
          メインメニューへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
