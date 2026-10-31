<script setup lang="ts">
import { useCommentsDestroy } from '@/composables/comments/useCommentsDestroy'
import type { MessageEmit } from '@/env'
import type { Comment } from '@/composables/comments/useCommentsShow'
import { toRefs } from 'vue'

export type Props = {
  makerId?: number
  sampleId?: number
  comment?: Comment
  isAdmin: boolean

}

const emit = defineEmits<MessageEmit>()
const props = defineProps<Props>()

const { makerId, sampleId, comment } = toRefs(props)
const { handleDelete } = useCommentsDestroy(emit, makerId, sampleId, comment)
</script>

<template>
  <div class="d-flex justify-content-end mt-5">
    <button
      v-show="isAdmin"
      class="btn btn-outline-danger shadow-sm"
      type="button"
      @click="handleDelete"
    >
      コメント情報の削除
    </button>
  </div>
</template>
