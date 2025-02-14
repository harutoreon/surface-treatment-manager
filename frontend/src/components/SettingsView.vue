<script setup>
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">アプリケーションの管理</h3>

    <div class="list-group list-group-flush border-top border-bottom mb-5">
      <!-- <a data-turbo-method="delete" data-turbo-confirm="本当にログアウトしますか？" class="list-group-item list-group-item-action pt-4 pb-4" href="/logout"> -->
        <RouterLink to="#" class="list-group-item list-group-item-action pt-4 pb-4">
          <h6 class="fw-bold text-primary">ログアウト</h6>
          <small>アプリケーションからログアウトします。</small>
        </RouterLink>
      <!-- </a> -->
    </div>

    <div class="d-flex justify-content-center">
      <RouterLink to="/" class="me-5">メインメニューへ</RouterLink>
      <RouterLink to="/">ログインページへ</RouterLink>
    </div>
    <!-- <div class="text-center"><a href="/home">メインメニューへ</a></div> -->
  </div>
</template>
