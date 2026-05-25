<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { checkLoginStatus } from '@/components/utils.js'
import { useSamplesEdit } from '@/composables/samples/useSamplesEdit.ts'
import type { Emit } from '@/composables/samples/useSamplesEdit.ts'

const emit = defineEmits<Emit>()
const { sample, errorMessage, fetchSampleData, sampleUpdate } = useSamplesEdit(emit)
const route = useRoute()
const router = useRouter()

const cancel = (): void => {
  if (sample.value?.id) router.replace(`/samples/${sample.value.id}`)
}

onMounted(async (): Promise<void> => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })
  if (loggedIn) await fetchSampleData(route.params.id as string)
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center m-5">
      表面処理情報の編集
    </h3>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>
    
    <form v-if="sample" @submit.prevent="sampleUpdate">
      <div class="row">
        <div class="col">
          <label class="form-label" for="sample-name">
            処理名
          </label>
          <input
            id="sample-name"
            v-model="sample.name"
            class="form-control mb-3 shadow-sm"
            type="text"
          />
        </div>
        <div class="col">
          <label class="form-label" for="sample-color">
            色
          </label>
          <input
            id="sample-color"
            v-model="sample.color"
            class="form-control mb-3 shadow-sm"
            type="text"
          />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <label class="form-label" for="sample-hardness">
            硬度
          </label>
          <input
            id="sample-hardness"
            v-model="sample.hardness"
            class="form-control mb-3 shadow-sm"
            type="text"
          />
        </div>
        <div class="col">
          <label class="form-label" for="sample-film-thickness">
            膜厚
          </label>
          <input
            id="sample-film-thickness"
            v-model="sample.film_thickness"
            class="form-control mb-3 shadow-sm"
            type="text"
          />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <label class="form-label" for="sample-feature">
            特徴
          </label>
          <input
            id="sample-feature"
            v-model="sample.feature"
            class="form-control mb-3 shadow-sm"
            type="text"
          />
        </div>
        <div class="col">
          <label class="form-label" for="sample-summary">
            概要
          </label>
          <input
            id="sample-summary"
            v-model="sample.summary"
            class="form-control mb-3 shadow-sm"
            type="text"
          />
        </div>
      </div>

      <label class="form-label" for="sample-image">
        画像
      </label>
      <div>
        <img
          v-if="sample.image_url"
          id="sample-image"
          :src="sample.image_url"
          alt="No Image"
          class="rounded-4 mb-3 shadow"
          width="200"
          height="200"
        />
      </div>

      <div class="d-grid gap-2 d-md-block mb-5">
        <button type="submit" class="btn btn-primary me-md-2 shadow">
          更新
        </button>
        <button
          v-if="sample.id"
          type="button"
          class="btn btn-outline-secondary shadow-sm"
          @click="cancel"
        >
          キャンセル
        </button>
      </div>
    </form>
  </div>
</template>
