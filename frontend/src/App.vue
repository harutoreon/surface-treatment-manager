<script setup>
// import { ref, onMounted } from 'vue'
// import axios from 'axios'
// import LoginView from './components/LoginView.vue';

// const user = ref(null)

// const setUser = (newUser) => {
//   user.value = newUser
// }

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// const logout = async () => {
//   try {
//     await axios.delete(`${API_BASE_URL}/logout`)
//     user.value = null
//   } catch (error) {
//     console.error('Logout failed')
//   }
// }

// const checkLoginStatus = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/logged_in`)
//     user.value = response.data.user || null
//   } catch (error) {
//     console.error('Failed to check login status')
//   }
// }

// onMounted(() => {
//   checkLoginStatus()
// })
// document.addEventListener('DOMContentLoaded', function() {
//   let radio1 = document.getElementById('general_user');
//   let radio2 = document.getElementById('admin_user');
//   let usernameField = document.getElementById('name');
//   let userpasswordField = document.getElementById('password');

//   radio1.addEventListener('change', function() {
//     if (radio1.checked) {
//       usernameField.value = 'general user';
//       userpasswordField.value = 'generalpassword';
//     }
//   });

//   radio2.addEventListener('change', function() {
//     if (radio2.checked) {
//       usernameField.value = 'admin user';
//       userpasswordField.value = 'adminpassword';
//     }
//   });
// });

// import LoginForm from './components/LoginForm.vue'
</script>

<template>
  <header>
    <nav class="navbar bg-body-tertiary border-bottom">
      <div class="container justify-content-center">
        <a class="navbar-brand" href="#">Surface Treatment Manager</a>
      </div>
    </nav>
  </header>

  <RouterView />
  
  <!-- <div> -->
    <!-- <header>
      <h1>Welcome {{ user ? user.name : 'Guest' }}</h1>
      <button v-if="user" v-on:click="logout">Logout</button>
    </header> -->
    <!-- <main>
      <LoginView v-if="!user" @login-success="setUser"/>
    </main> -->
    <!-- <div class="container w-25">

      <h3 class="text-center mt-5 mb-5">ログイン</h3>

      <label>ユーザーの選択</label>

      <ul class="list-group mb-4">
        <li class="list-group-item">
          <div class="form-check">
            <input class="form-check-input" type="radio" name="select_user" id="general_user" value="general_user">
            <label class="form-check-label" for="general_user">一般ユーザー</label>
          </div>
          <small class="ms-4">一部の機能は制限されます。</small>
        </li>
        <li class="list-group-item">
          <div class="form-check">
            <input class="form-check-input" type="radio" name="select_user" id="admin_user" value="admin_user">
            <label class="form-check-label" for="admin_user">管理者ユーザー</label>
          </div>
          <small class="ms-4">すべての機能が利用できます。</small>
        </li>
      </ul>

      <form action="#" accept-charset="UTF-8" method="post"><input type="hidden" name="authenticity_token" value="BFnGCq8MFwhs3_ggh5BJFgFppk5VnAtKXLVCWNX5tu1vnl2lB2BunGielvf7GxnxYF6T1R07CQkYNMNhl5p2Xw" autocomplete="off">
        <label for="name">ユーザー名</label>
        <input class="form-control mb-3" id="name" type="text" name="session[name]">

        <label for="password">パスワード</label>
        <input class="form-control mb-4" id="password" type="password" name="session[password]">

        <input type="submit" name="commit" value="ログイン" class="form-control btn btn-primary" data-disable-with="ログイン">
      </form>
    </div> -->

    <!-- <div class="text-center mt-5">
      <RouterLink to="#">logout page</RouterLink>
    </div> -->
  <!-- </div> -->


</template>
