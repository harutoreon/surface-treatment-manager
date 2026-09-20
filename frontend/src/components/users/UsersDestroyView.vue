<script setup lang="ts">
import { useUsersDestroy } from '@/composables/users/useUsersDestroy'
import type { MessageEmit } from '@/env'

const emit = defineEmits<MessageEmit>()
const { handleDelete } = useUsersDestroy(emit)
</script>

<template>
  <div class="d-flex justify-content-end mt-5">
    <button
      class="btn btn-outline-danger shadow-sm"
      type="button"
      @click="handleDelete"
    >
      ユーザーの削除
    </button>
  </div>
</template>
