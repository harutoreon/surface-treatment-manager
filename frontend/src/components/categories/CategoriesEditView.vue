<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">カテゴリー情報の編集</h3>

    <!-- <form v-on:submit.prevent="categoryRegistration"> -->
    <form>
      <label class="form-label" for="category_item">カテゴリー名</label>
      <!-- <input v-model="item" cla÷ss="form-control mb-4" type="text" id="category_item" required/> -->
      <input class="form-control mb-4" type="text" name="category[item]" id="category_item" required/>

      <label class="form-label" for="category_summary">概要</label>
      <!-- <textarea v-model="summary" class="form-control mb-4" id="category_summary" required></textarea> -->
      <textarea class="form-control mb-4" name="category[summary]" id="category_summary" required></textarea>
      
      <button type="submit" class="form-control btn btn-primary mb-5">登録</button>
    </form>

    <!-- <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">{{ errorMessage }}</p> -->

    <div class="d-flex justify-content-evenly">
      <!-- <RouterLink v-bind:to="`/users/${user.id}`" id="user_information">ユーザー情報</RouterLink> -->
      <a href="#">カテゴリー情報へ</a>
      <!-- <RouterLink to="/users" id="user_list">ユーザーリスト</RouterLink> -->
      <a href="/categories">カテゴリーリストへ</a>
    </div>
  </div>  
</template>