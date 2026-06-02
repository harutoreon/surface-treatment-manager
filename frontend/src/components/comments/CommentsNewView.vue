<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { checkLoginStatus } from '@/components/utils.js'
import { useCommentsNew } from '@/composables/comments/useCommentsNew.ts'
import type { UserResponse, Emit } from '@/composables/comments/useCommentsNew.ts'

const emit = defineEmits<Emit>()
const router = useRouter()
const isOpen = ref<boolean>(false)
const maker = ref<string>('')
const sampleName = ref<string>('')

const {
  users,
  makerOptions,
  makerId,
  sampleId,
  sampleOptions,
  commenter,
  userId,
  department,
  body,
  errorMessage,
  fetchUserList,
  fetchMakerData,
  fetchSampleData,
  commentRegistration
} = useCommentsNew(emit)

const close = (): void => {
  window.setTimeout(() => {
    isOpen.value = false
  }, 100)
}

const filteredList = computed<UserResponse[]>(() => {
  if (!commenter.value) return []
  const word = commenter.value.toLowerCase()

  return users.value.filter( user =>
    user.userName.toLowerCase().includes(word)
  )
})

const select = (userName: string): void => {
  const selectedUser = users.value.find(user => user.userName === userName)

  if (selectedUser) {
    commenter.value = selectedUser.userName
    department.value = selectedUser.userDepartment
    userId.value = selectedUser.userId
  }

  isOpen.value = false
}

const handleMakerChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement
  const selected = makerOptions.value.find(
    option => option.name === target.value
  )
  makerId.value = selected?.id || null
}

const handleSampleChange = (event): void => {
  const target = event.target as HTMLSelectElement
  const selected = sampleOptions.value.find(
    option => option.name === target.value
  )
  sampleId.value = selected?.id || null
}

watch(makerId, fetchSampleData)

onMounted(async (): Promise<void> => {
  const loggedIn = await checkLoginStatus(() => {
    emit('message', { type: 'danger', text: 'ログインが必要です。' })
    router.push('/')
  })

  if (loggedIn) {
    await fetchMakerData()
    await fetchUserList()
  }
})
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      コメント情報の新規登録
    </h3>

    <p v-if="errorMessage" class="alert alert-danger mb-4" role="alert">
      {{ errorMessage }}
    </p>

    <form @submit.prevent="commentRegistration">
      <label class="form-label" for="commenter">
        投稿者
      </label>
      <div class="position-relative mb-4">
        <input
          id="commenter"
          v-model="commenter"
          type="text"
          class="form-control mb-3 shadow-sm"
          placeholder="投稿者名の一部をここに入力して下さい"
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
            :key="item.userId"
            class="list-group-item list-group-item-action text-start"
            @mousedown.prevent="select(item.userName)"
          >
            {{ item.userName }}
          </li>
        </ul>
      </div>

      <label class="form-label" for="departments">
        部署名
      </label>
      <input
        id="department"
        v-model="department"
        class="form-control mb-4 shadow-sm"
        placeholder="ユーザー入力は不要です"
        type="text"
      />

      <label class="form-label" for="makers">
        メーカー
      </label>
      <select
        id="makers"
        v-model="maker"
        class="form-select mb-4 shadow-sm"
        @change="handleMakerChange"
      >
        <option value="">
          メーカーを選択して下さい
        </option>
        <option
          v-for="option in makerOptions"
          :key="option.id"
          :value="option.name"
        >
          {{ option.name }}
        </option>
      </select>

      <label v-if="makerId" class="form-label" for="samples">
        表面処理
      </label>
      <select
        v-if="makerId"
        id="samples"
        v-model="sampleName"
        class="form-select mb-4 shadow-sm"
        @change="handleSampleChange"
      >
        <option value="">
          表面処理を選択して下さい
        </option>
        <option
          v-for="option in sampleOptions"
          :key="option.id"
          :value="option.name"
        >
          {{ option.name }}
        </option>
      </select>

      <label class="form-label" for="body">
        コメント
      </label>
      <textarea id="body" v-model="body" class="form-control mb-5 shadow-sm" />

      <button type="submit" class="form-control btn btn-primary mb-5 shadow">
        登録
      </button>
    </form>

    <ul class="nav justify-content-center">
      <li class="nav-item">
        <RouterLink to="/comments" class="d-flex justify-content-evenly">
          コメントリストへ
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
