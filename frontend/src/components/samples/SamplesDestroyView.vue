<script setup lang="ts">
import { useSamplesDestroy } from '@/composables/samples/useSamplesDestroy'
import type { Sample } from '@/composables/samples/useSamplesShow'
import type { MessageEmit } from '@/env'
import { toRefs } from 'vue'

export type Props = {
  sample?: Sample
}

const emit = defineEmits<MessageEmit>()
const props = defineProps<Props>()
const { sample } = toRefs(props)
const { handleDelete } = useSamplesDestroy(emit, sample)
</script>

<template>
  <div class="d-flex justify-content-end mb-5">
    <button
      id="handle-delete"
      class="btn btn-outline-danger shadow-sm"
      type="button"
      @click="handleDelete"
    >
      表面処理情報の削除
    </button>
  </div>
</template>
