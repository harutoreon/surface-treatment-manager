<script setup>
import { onMounted } from 'vue'
import { useStaticPagesMaker } from '@/composables/useStaticPagesMaker.js'

const emit = defineEmits(['message'])

const {
  keyword,
  errorMessage,
  isOpen,
  fetchMakerList,
  close,
  filteredList,
  select,
  submitSearch,
  loggedIn
} = useStaticPagesMaker(emit)

onMounted(async () => {
  if (await loggedIn) {
    await fetchMakerList()
  }
})
</script>

<template>
  <div class="container text-center w-25">
    <h3 class="m-5">
      メーカー名で検索
    </h3>

    <p
      v-if="errorMessage"
      class="alert alert-danger mt-4"
      role="alert"
    >
      {{ errorMessage }}
    </p>

    <form @submit.prevent="submitSearch">
      <div class="position-relative mb-3">
        <input
          v-model="keyword"
          type="text"
          class="form-control mb-3 shadow-sm"
          placeholder="キーワードをここに入力"
          autocomplete="off"
          @focus="isOpen = true"
          @blur="close"
        />

        <ul
          v-if="isOpen && filteredList.length"
          class="list-group position-absolute w-100 shadow"
          style="z-index: 1000;"
        >
          <li
            v-for="item in filteredList"
            :key="item"
            class="list-group-item list-group-item-action text-start"
            @mousedown.prevent="select(item)"
          >
            {{ item }}
          </li>
        </ul>
      </div>

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
