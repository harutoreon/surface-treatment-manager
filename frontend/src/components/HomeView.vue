<script setup>
import experimentIcon from '@/assets/icons/experiment.svg'
import categoryIcon from '@/assets/icons/category.svg'
import factoryIcon from '@/assets/icons/factory.svg'
import listIcon from '@/assets/icons/list.svg'
import libraryAddIcon from '@/assets/icons/library_add.svg'
import categoryAddIcon from '@/assets/icons/category_add.svg'
import makerAddIcon from '@/assets/icons/maker_add.svg'
import userAddIcon from '@/assets/icons/user_add.svg'
import settingsIcon from '@/assets/icons/settings.svg'
</script>

<template>
  <div class="container w-75">
    <h3 class="text-center mt-5 mb-5">メインメニュー</h3>

    <div class="row mb-4">
      <div class="col ps-0 pe-0">
        <div class="card pt-2" style="width: 19rem;">
          <img alt="experiment icon" class="card-img-top w-25" width="50" height="50" v-bind:src="experimentIcon">
          <div class="card-body">
            <h5 class="card-title">処理名で検索</h5>
            <p class="card-text">処理名を入力して表面処理を検索します。</p>
            <RouterLink to="#" class="card-link">検索ページへ</RouterLink>
          </div>
        </div>
      </div>
      <div class="col ps-0 pe-0">
        <div class="card pt-2" style="width: 19rem;">
          <img alt="category icon" class="card-img-top w-25" width="50" height="50" v-bind:src="categoryIcon">
          <div class="card-body">
            <h5 class="card-title">カテゴリーで検索</h5>
            <p class="card-text">カテゴリーを選択して表面処理を検索します。</p>
            <RouterLink to="#" class="card-link">検索ページへ</RouterLink>
          </div>
        </div>
      </div>
      <div class="col ps-0 pe-0">
        <div class="card pt-2" style="width: 19rem;">
          <img alt="factory icon" class="card-img-top w-25" width="50" height="50" v-bind:src="factoryIcon">
          <div class="card-body">
            <h5 class="card-title">メーカー名で検索</h5>
            <p class="card-text">メーカー名を入力して表面処理を検索します。</p>
            <RouterLink to="#" class="card-link">検索ページへ</RouterLink>
          </div>
        </div>
      </div>
      <div class="col ps-0 pe-0">
        <div class="card pt-2" style="width: 19rem;">
          <img alt="list icon" class="card-img-top w-25" width="50" height="50" v-bind:src="listIcon">
          <div class="card-body">
            <h5 class="card-title">処理一覧から検索</h5>
            <p class="card-text">表面処理一覧から目的の処理を検索します。</p>
            <RouterLink to="#" class="card-link">検索ページへ</RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col ps-0 pe-0">
        <div class="card pt-2" style="width: 19rem;">
          <img alt="library add icon" class="card-img-top w-25" width="50" height="50" v-bind:src="libraryAddIcon">
          <div class="card-body">
            <h5 class="card-title">表面処理の管理</h5>
            <p class="card-text">表面処理に関する情報を一括管理します。</p>
            <RouterLink to="/samples" class="card-link">管理ページへ</RouterLink>
          </div>
        </div>
      </div>
      <div class="col ps-0 pe-0">
        <div class="card pt-2" style="width: 19rem;">
          <img alt="category add icon" class="card-img-top w-25" width="50" height="50" v-bind:src="categoryAddIcon">
          <div class="card-body">
            <h5 class="card-title">カテゴリーの管理</h5>
            <p class="card-text">カテゴリーに関する情報を一括管理します。</p>
            <RouterLink to="/categories" class="card-link">管理ページへ</RouterLink>
          </div>
        </div>
      </div>
      <div class="col ps-0 pe-0">
        <div class="card pt-2" style="width: 19rem;">
          <img alt="maker add icon" class="card-img-top w-25" width="50" height="50" v-bind:src="makerAddIcon">
          <div class="card-body">
            <h5 class="card-title">メーカーの管理</h5>
            <p class="card-text">メーカーに関する情報を一括管理します。</p>
            <RouterLink to="/makers" class="card-link">管理ページへ</RouterLink>
          </div>
        </div>
      </div>
      <div class="col ps-0 pe-0">
        <div class="card pt-2" style="width: 19rem;">
          <img alt="user add icon" class="card-img-top w-25" width="50" height="50" v-bind:src="userAddIcon">
          <div class="card-body">
            <h5 class="card-title">ユーザーの管理</h5>
            <p class="card-text">ユーザーに関する情報を一括管理します。</p>
            <RouterLink to="/users" class="card-link">管理ページへ</RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col ps-0 pe-0">
        <div class="card pt-2" style="width: 19rem;">
          <img alt="settings icon" class="card-img-top w-25" width="50" height="50" v-bind:src="settingsIcon">
          <div class="card-body">
            <h5 class="card-title">アプリケーションの管理</h5>
            <p class="card-text">アプリケーションの設定やログアウトを行います。</p>
            <RouterLink to="/settings" class="card-link">管理ページへ</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>