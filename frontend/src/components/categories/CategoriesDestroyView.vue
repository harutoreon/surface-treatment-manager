<script setup lang="ts">
import { useCategoriesDestroy } from '@/composables/categories/useCategoriesDestroy'
import type { MessageEmit } from '@/env'

const emit = defineEmits<MessageEmit>()
const { handleDelete } = useCategoriesDestroy(emit)
</script>

<template>
  <div class="d-flex justify-content-end mt-5">
    <button
      class="btn btn-outline-danger shadow-sm"
      type="button"
      @click="handleDelete"
    >
      カテゴリー情報の削除
    </button>
  </div>
</template>
