<script setup>
import { onMounted } from 'vue'
import { useSearchResultsList } from '@/composables/useSearchResultsList.js'

const emit = defineEmits(['message'])
const { samples, loggedIn, fetchSearchResults } = useSearchResultsList(emit)

onMounted(async () => {
  if ( await loggedIn) {
    await fetchSearchResults()
  }
})
</script>

<template>
  <div class="container">
    <h3 class="text-center m-5">
      表面処理一覧
    </h3>

    <div class="album">
      <div class="row row-cols-5 g-3">
        <div v-for="sample in samples" :key="sample.id" class="col">
          <div class="card shadow">
            <img
              :src="sample.image_url"
              class="card-img-top"
              alt="Sample Image"
              width="100%"
              height="225"
            />
            <div class="card-body">
              <div class="fs-5 card-title mb-3">
                {{ sample.name }}
              </div>
              <div class="card-text mb-3">
                {{ sample.summary }}
              </div>
              <RouterLink
                :to="`/samples/${sample.id}`"
                class="btn btn-primary shadow-lg"
              >
                詳細へ
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ul class="nav justify-content-center mt-5 mb-5">
      <li class="nav-item">
        <RouterLink to="/home">
          メインメニューへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
