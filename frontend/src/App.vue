<script setup>
import { ref } from "vue"

const name = ref('')
const password = ref('')

const user = ref([{
  name: '',
  password: ''
}])

function getUserInformation() {
  user.value.name = name.value
  user.value.password = password.value
}
</script>

<template>
  <h3>ログイン</h3>

  <label for="name">ユーザー名</label>
  <input type="text" id="name" v-model="name"><br>

  <label for="password">パスワード</label>
  <input type="password" id="password" v-model="password"><br>

  <input type="submit" value="ログイン" v-on:click="getUserInformation">

  <p>ユーザー名 : {{ user.name }}</p>
  <p>パスワード : {{ user.password }}</p>
</template>
