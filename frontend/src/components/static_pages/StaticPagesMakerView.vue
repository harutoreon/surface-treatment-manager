<template>
  <div class="container text-center w-25">
    <h3 class="mt-5 mb-5">
      メーカー名で検索
    </h3>
    <!-- <form v-on:submit.prevent="submitSearch"> -->
    <form>
      <!-- v-model="keyword" -->
      <input
        type="text"
        class="form-control mb-3"
        placeholder="キーワードをここに入力"
      />
      <button type="submit" class="btn btn-secondary form-control mb-5">検索</button>
    </form>
    <div>
      <RouterLink to="/home" ref="linkHome">メインメニューへ</RouterLink>
    </div>
  </div>
</template>
