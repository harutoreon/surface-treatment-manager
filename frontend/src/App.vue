<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { Toast } from 'bootstrap'

const messageType = ref('')
const message = ref('')
const route = useRoute()
const toastEl = ref(null)

const showMessage = async (payload) => {
  messageType.value = payload.type
  message.value = payload.text
  await nextTick()
  Toast.getOrCreateInstance(toastEl.value, { delay: 3000 }).show()
}

const handleMessageDelete = () => {
  messageType.value = ''
  message.value = ''
}

onMounted(() => {
  toastEl.value.addEventListener('hidden.bs.toast', handleMessageDelete)
})

onBeforeUnmount(() => {
  toastEl.value?.removeEventListener('hidden.bs.toast', handleMessageDelete)
  Toast.getInstance(toastEl.value)?.dispose()
})
</script>

<template>
  <header v-if="route.path !== '/'">
    <nav class="navbar bg-body-tertiary border-bottom">
      <div class="container justify-content-center">
        <RouterLink to="/home" class="navbar-brand">
          Surface Treatment Manager
        </RouterLink>
      </div>
    </nav>
  </header>

  <!-- top-0 だとトーストが header と重なって見栄えが悪いので top-25 に設定 -->
  <div class="toast-container position-fixed top-25 end-0 p-3">
    <div
      ref="toastEl"
      :class="`toast align-items-center border-0 text-bg-${messageType || 'secondary'}`"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">
          {{ message }}
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          aria-label="通知を閉じる"
          data-bs-dismiss="toast"
        />
      </div>
    </div>
  </div>

  <RouterView @message="showMessage" />
</template>

<style scoped>
/* 変化を滑らかにする設定 */
.toast {
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.5s ease;
}

/* 「画面外の上」の状態 */
.toast.showing {
  opacity: 0;
  transform: translateY(-150%);
}

/* 動きを減らす設定への配慮 */
@media (prefers-reduced-motion: reduce) {
  .toast {
    transition: opacity 0.15s linear;
  }

  .toast.showing {
    transform: none;
  }
}
</style>