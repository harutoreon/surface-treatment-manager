<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">カテゴリー情報の登録</h3>

    <form>
      <label class="form-label" for="category_item">カテゴリー名</label>
      <input class="form-control mb-4" type="text" name="category[item]" id="category_item" />

      <label class="form-label" for="category_summary">概要</label>
      <input class="form-control mb-4" type="text" name="category[summary]" id="category_summary" />

      <input type="submit" name="commit" value="登録" class="form-control btn btn-primary mb-5" data-disable-with="登録" />
    </form>

    <div class="d-flex justify-content-evenly">
      <RouterLink to="/categories">カテゴリーリストへ</RouterLink>
    </div>
  </div>
</template>
