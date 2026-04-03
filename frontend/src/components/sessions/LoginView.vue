<script setup>
import { useLogin } from '@/composables/useLogin.js'

const emit = defineEmits(['login-success', 'message'])

const {
  name,
  password,
  selectedUserType,
  errorMessage,
  changeToAdminUserData,
  changeToGeneralUserData,
  handleLogin
} = useLogin(emit)
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center m-5">
      ログイン
    </h3>

    <div>ユーザーの選択</div>

    <ul class="list-group mb-4 shadow-sm">
      <li class="list-group-item">
        <div class="form-check">
          <input
            id="general-user"
            v-model="selectedUserType"
            class="form-check-input"
            type="radio"
            value="general"
            @change="changeToGeneralUserData"
          />
          <label
            class="form-check-label"
            for="general-user"
          >
            一般ユーザー
          </label>
        </div>
        <small class="ms-4">
          表面処理情報の検索ができます。
        </small>
      </li>
      <li class="list-group-item">
        <div class="form-check">
          <input
            id="admin-user"
            v-model="selectedUserType"
            class="form-check-input"
            type="radio"
            value="admin"
            @change="changeToAdminUserData"
          />
          <label
            class="form-check-label"
            for="admin-user"
          >
            管理者ユーザー
          </label>
        </div>
        <small class="ms-4">
          表面処理情報やメーカー情報を含むリソースを管理します。
        </small>
      </li>
    </ul>

    <form @submit.prevent="handleLogin">
      <label for="user-name">
        ユーザー名
      </label>
      <input
        id="user-name"
        v-model="name"
        class="form-control mb-4 shadow-sm"
        type="text"
      />
      <label for="user-password">
        パスワード
      </label>
      <input
        id="user-password"
        v-model="password"
        class="form-control mb-5 shadow-sm"
        type="password"
      />
      <button
        type="submit"
        class="form-control btn btn-primary shadow-lg"
      >
        ログイン
      </button>
    </form>

    <p
      v-if="errorMessage"
      class="alert alert-danger mt-4"
      role="alert"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
