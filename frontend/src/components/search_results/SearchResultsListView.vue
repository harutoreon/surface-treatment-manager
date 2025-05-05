<template>
  <div class="container">
    <h3 class="text-center mt-5 mb-5">表面処理一覧</h3>

    <div class="album">
      <div class="row row-cols-5 g-3">
        <div class="col">
          <div class="card">
            <img src="@/assets/images/electroless_nickel_plating.png" class="card-img-top" alt="Sample Image" width="100%" height="225">
            <div class="card-body">
              <h5 class="card-title mb-3">無電解ニッケルめっき</h5>
              <p class="card-text">電気を使わずに化学反応を利用して金属や樹脂などの表面にニッケルの薄膜を形成する表面処理技術です。</p>
              <a href="#" class="btn btn-primary">詳細へ</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-evenly mt-5 mb-5">
      <RouterLink to="/home" id="link_home" ref="linkHome">メインメニューへ</RouterLink>
    </div>
  </div>
</template>