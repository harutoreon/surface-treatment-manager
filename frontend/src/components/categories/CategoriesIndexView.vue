<script setup>

</script>

<template>
  <div class="container w-50">
    <h3 class="text-center mt-5 mb-5">カテゴリーリスト</h3>

    <div class="list-group list-group-flush mb-5">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6>カテゴリー名</h6>
          <h6>概要</h6>
        </div>
      </div>

      <RouterLink to="#" class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6>めっき</h6>
          <h6>金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。</h6>
        </div>        
      </RouterLink>

      <RouterLink to="#" class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6>陽極酸化</h6>
          <h6>人工的にアルミニウム表面に分厚い酸化アルミニウム被膜を作る処理のこと。</h6>
        </div>
      </RouterLink>

      <RouterLink to="#" class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6>化成</h6>
          <h6>金属の表面に処理剤を作用させて化学反応を起こさせる処理のこと。</h6>
        </div>
      </RouterLink>

      <RouterLink to="#" class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6>コーティング</h6>
          <h6>溶射金属やセラミックスの粉末を、溶解状態にして製品表面に吹き付ける処理のこと。</h6>
        </div>
      </RouterLink>

      <RouterLink to="#" class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6>表面硬化</h6>
          <h6>主に金属材料に対して行われる、加熱・冷却・雰囲気により材料の性質を変化させる処理のこと。</h6>
        </div>
      </RouterLink>
    </div>

    <div class="d-flex justify-content-evenly">
      <RouterLink to="#">カテゴリー情報の登録</RouterLink>
      <RouterLink to="/home">メインメニューへ</RouterLink>
    </div>
  </div>
</template>