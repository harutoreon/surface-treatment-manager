<template>
  <div class="container text-center w-25">
    <h3 class="mt-5 mb-5">カテゴリーで検索</h3>
    <form>
      <select name="keyword" class="form-select mb-3">
        <option value="">カテゴリーを選択して下さい</option>
        <option value="めっき">めっき</option>
        <option value="陽極酸化">陽極酸化</option>
        <option value="化成">化成</option>
        <option value="コーティング">コーティング</option>
        <option value="表面硬化">表面硬化</option>
      </select>
      <button type="submit" class="btn btn-secondary form-control mb-5">検索</button>
    </form>
    <div>
      <RouterLink to="/home">メインメニューへ</RouterLink>
    </div>
  </div>
</template>

