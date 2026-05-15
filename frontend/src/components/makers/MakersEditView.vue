<script setup lang="ts">
import { onMounted } from 'vue'
import { useMakers } from '@/composables/useMakers.ts'

interface MessageEvent {
  type: 'danger' | 'success' | 'warning' | 'info'
  text: string
}

const emit = defineEmits<{
  message: [payload: MessageEvent]
}>()

const {
  route,
  router,
  maker,
  errorMessage,
  fetchMakerData,
  makerUpdate,
  loggedIn
} = useMakers(emit)

const cancel = (): void => {
  router.push(`/makers/${maker.value.id as string}`)
}

onMounted(async (): Promise<void> => {
  if (await loggedIn) await fetchMakerData(route.params.id as string)
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center m-5">
      メーカー情報の編集
    </h3>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>

    <form @submit.prevent="makerUpdate">
      <div class="row">
        <div class="col">
          <label class="form-label" for="maker-name">
            メーカー名
          </label>
          <input
            id="maker-name"
            v-model="maker.name"
            class="form-control mb-2 shadow-sm"
            type="text"
          />
        </div>
        <div class="col">
          <label class="form-label" for="maker-postal-code">
            郵便番号
          </label>
          <input
            id="maker-postal-code"
            v-model="maker.postal_code"
            class="form-control mb-2 shadow-sm"
            type="text"
          />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <label class="form-label" for="maker-address">
            住所
          </label>
          <input
            id="maker-address"
            v-model="maker.address"
            class="form-control mb-2 shadow-sm"
            type="text"
          />
        </div>
        <div class="col">
          <label class="form-label" for="maker-phone-number">
            電話番号
          </label>
          <input
            id="maker-phone-number"
            v-model="maker.phone_number"
            class="form-control mb-2 shadow-sm"
            type="tel"
          />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <label class="form-label" for="maker-fax-number">
            FAX番号
          </label>
          <input
            id="maker-fax-number"
            v-model="maker.fax_number"
            class="form-control mb-2 shadow-sm"
            type="tel"
          />
        </div>
        <div class="col">
          <label class="form-label" for="maker-email">
            Email
          </label>
          <input
            id="maker-email"
            v-model="maker.email"
            class="form-control mb-2 shadow-sm"
            type="email"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label class="form-label" for="maker-home-page">
            ホームページ
          </label>
          <input
            id="maker-home-page"
            v-model="maker.home_page"
            class="form-control mb-2 shadow-sm"
            type="url"
          />
        </div>
        <div class="col">
          <label class="form-label" for="maker-manufacturer-rep">
            担当者
          </label>
          <input
            id="maker-manufacturer-rep"
            v-model="maker.manufacturer_rep"
            class="form-control mb-3 shadow-sm"
            type="text"
          />
        </div>
      </div>

      <div class="d-grid gap-2 d-md-block">
        <button type="submit" class="btn btn-primary me-md-2 shadow">
          更新
        </button>
        <button
          v-if="maker.id"
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