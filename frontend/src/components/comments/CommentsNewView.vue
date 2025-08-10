<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      コメント情報の新規登録
    </h3>

    <form>
      <label class="form-label" for="commenter">
        投稿者
      </label>
      <input class="form-control mb-4" type="text" id="commenter"/>

      <label class="form-label" for="departments">
        部署名
      </label>
      <select class="form-select mb-4" id="departments">
        <option value="">
          部署名を選択して下さい
        </option>
        <option value="品質管理部">
          品質管理部
        </option>
        <option value="開発部">
          開発部
        </option>
        <option value="製造部">
          製造部
        </option>
        <option value="営業部">
          営業部
        </option>
      </select>

      <label class="form-label" for="samples">
        表面処理
      </label>
      <select class="form-select mb-4" id="samples">
        <option value="">
          表面処理を選択して下さい
        </option>
        <option value="硬質クロムめっき">
          硬質クロムめっき
        </option>
        <option value="無電解ニッケルめっき">
          無電解ニッケルめっき
        </option>
        <option value="金めっき">
          金めっき
        </option>
        <option value="窒化処理">
          窒化処理
        </option>
      </select>

      <label class="form-label" for="body">
        コメント
      </label>
      <textarea class="form-control mb-5" id="body">
      </textarea>
      
      <button type="submit" class="form-control btn btn-primary mb-5">
        登録
      </button>
    </form>

    <RouterLink to="/comments" class="d-flex justify-content-evenly">
      コメントリストへ
    </RouterLink>
  </div>
</template>
