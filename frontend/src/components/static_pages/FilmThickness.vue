<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { checkLoginStatus } from '@/components/utils.js'
import { useRouter } from 'vue-router'

type NotificationMessage = {
  type: 'danger'
  text: string
}

const emit = defineEmits<{ message: [payload: NotificationMessage] }>()
const router = useRouter()
const filmThickness = ref<number>(0)
const allowableError = ref<number>(0)
const minFilmThickness = ref<number>(0)
const maxFilmThickness = ref<number>(0)
const errorMessage = ref<string>('')

const submitSearch = (): void => {
  errorMessage.value = ''

  if (!filmThickness.value || !allowableError.value) {
    errorMessage.value = '変寸量または誤差を入力して下さい。'
    return
  }

  minFilmThickness.value = filmThickness.value - allowableError.value
  maxFilmThickness.value = filmThickness.value + allowableError.value

  router.push({
    path: '/static_pages/film_thickness/search_results',
    query: {
      min_film_thickness: minFilmThickness.value,
      max_film_thickness: maxFilmThickness.value
    },
  })
}

onMounted(async (): Promise<void> => {
  await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
})
</script>

<template>
  <div class="container w-25">
    <h3 class="m-5 text-center">
      変寸量で検索
    </h3>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>

    <form @submit.prevent="submitSearch">
      <label class="form-label text-start">膜厚（μm）</label>
      <input
        id="film-thickness"
        v-model.number="filmThickness"
        type="number"
        class="form-control mb-3 shadow-sm"
        min="0"
        step="1"
      />
      <label class="form-label">誤差（±μm）</label>
      <input
        id="allowable-error"
        v-model.number="allowableError"
        type="number"
        class="form-control mb-4 shadow-sm"
        min="0"
        step="1"
      />
      <button type="submit" class="btn btn-secondary form-control mb-5 shadow">
        検索
      </button>
    </form>

    <ul class="nav justify-content-center">
      <li class="nav-item">
        <RouterLink to="/home">
          メインメニューへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
