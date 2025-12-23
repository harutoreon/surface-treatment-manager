<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const keyword = ref('')
const router = useRouter()
const errorMessage = ref('')
const isOpen = ref(false)
const makers = []

const fetchMakerList = async () => {
  const response = await axios.get(`${API_BASE_URL}/maker_list`)
  const makerList = response.data
  for (const makerListElement of makerList) {
    makers.push(makerListElement.name)
  }
}

const close = () => {
  window.setTimeout(() => {
    isOpen.value = false
  }, 100)
}

const filteredList = computed(() => {
  if (!keyword.value) return []
  const word = keyword.value.toLowerCase()

  return makers.filter( maker =>
    maker.toLowerCase().includes(word)
  )
})

const select = (item) => {
  keyword.value = item
  isOpen.value = false
}

const submitSearch = () => {
  if (!keyword.value) {
    errorMessage.value = 'キーワードが未入力です'
    return
  }
  router.push({
    name: 'SearchResults',
    params: { searchMethod: 'maker' },
    query: { keyword: keyword.value }
  })
}

onMounted(async () => {
  await fetchMakerList()
})
</script>

<template>
  <div class="container text-center w-25">
    <h3 class="mt-5 mb-5">
      メーカー名で検索
    </h3>

    <p
      v-if="errorMessage"
      class="alert alert-danger mt-4"
      role="alert"
    >
      {{ errorMessage }}
    </p>

    <form v-on:submit.prevent="submitSearch">
      <div class="position-relative mb-3">
        <input
          v-model="keyword"
          type="text"
          v-on:focus="isOpen = true"
          v-on:blur="close"
          class="form-control mb-3"
          placeholder="キーワードをここに入力"
          autocomplete="off"
        />

        <ul
          v-if="isOpen && filteredList.length"
          class="list-group position-absolute w-100 shadow"
          style="z-index: 1000;"
        >
          <li
            v-for="item in filteredList"
            v-bind:key="item"
            v-on:mousedown.prevent="select(item)"
            class="list-group-item list-group-item-action text-start"
          >
            {{ item }}
          </li>
        </ul>
      </div>

      <button type="submit" class="btn btn-secondary form-control mb-5">
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
