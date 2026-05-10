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

const { route, maker, fetchMakerData, handleDelete, loggedIn } = useMakers(emit)

onMounted(async (): Promise<void> => {
  if (await loggedIn) await fetchMakerData(route.params.id as string)
})
</script>

<template>
  <div class="container w-50">
    <h3 class="text-center m-5">
      メーカー情報
    </h3>

    <div class="list-group mb-5 shadow-sm">
      <li class="d-flex justify-content-between list-group-item">
        <span>メーカー名:</span>
        <div>{{ maker.name }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>郵便番号:</span>
        <div>{{ maker.postal_code }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>住所:</span>
        <div>{{ maker.address }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>電話番号:</span>
        <div>{{ maker.phone_number }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>FAX番号:</span>
        <div>{{ maker.fax_number }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>Email:</span>
        <div>{{ maker.email }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>ホームページ:</span>
        <div>{{ maker.home_page }}</div>
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <span>担当者:</span>
        <div>{{ maker.manufacturer_rep }}</div>
      </li>
    </div>

    <ul class="nav justify-content-evenly">
      <li class="nav-item">
        <RouterLink v-if="maker.id" :to="`/makers/${maker.id}/edit`">
          メーカー情報の編集へ
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/makers">
          メーカーリストへ
        </RouterLink>
      </li>
    </ul>

    <div class="d-flex justify-content-end mt-5">
      <button class="btn btn-outline-danger shadow-sm" type="button" @click="handleDelete">
        メーカー情報の削除
      </button>
    </div>
  </div>
</template>
