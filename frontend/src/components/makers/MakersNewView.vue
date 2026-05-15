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
  name,
  postalCode,
  address,
  phoneNumber,
  faxNumber,
  email,
  homePage,
  manufacturerRep,
  errorMessage,
  makerRegistration,
  loggedIn
} = useMakers(emit)

onMounted(async (): Promise<void> => {
  await loggedIn
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center m-5">
      メーカー情報の登録
    </h3>

    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </p>

    <form @submit.prevent="makerRegistration">
      <div class="row">
        <div class="col">
          <label class="form-label" for="maker-name">
            メーカー名
          </label>
          <input
            id="maker-name"
            v-model="name"
            class="form-control mb-2 shadow-sm"
            type="text"
            required
          />
        </div>
        <div class="col">
          <label class="form-label" for="maker-postal-code">
            郵便番号
          </label>
          <input
            id="maker-postal-code"
            v-model="postalCode"
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
            v-model="address"
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
            v-model="phoneNumber"
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
            v-model="faxNumber"
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
            v-model="email"
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
            v-model="homePage"
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
            v-model="manufacturerRep"
            class="form-control mb-4 shadow-sm"
            type="text"
          />
        </div>
      </div>

      <button type="submit" class="form-control btn btn-primary mb-5 shadow">
        登録
      </button>
    </form>

    <ul class="nav justify-content-center mb-5">
      <li class="nav-item">
        <RouterLink to="/makers">
          メーカーリストへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
