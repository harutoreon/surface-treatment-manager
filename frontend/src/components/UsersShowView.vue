<script setup>
</script>

<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">ユーザー情報</h3>

    <div class="list-group mb-5">
      <li class="d-flex justify-content-between list-group-item">
        <div>ユーザー名：</div>
        <div>Sample User</div>
        <!-- <div>{{ user.name }}</div> -->
      </li>
      <li class="d-flex justify-content-between list-group-item">
        <div>部署名：</div>
        <div>製造部</div>
        <!-- <div>{{ user.department }}</div> -->
      </li>
    </div>

    <div class="d-flex justify-content-evenly">
      <RouterLink to="#">ユーザー情報の編集</RouterLink>
      <RouterLink to="/users">ユーザーリスト</RouterLink>
    </div>
  </div>
</template>