<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">
      部署情報の登録
    </h3>

    <form>
      <label class="form-label" for="department-name">
        部署名
      </label>
      <input
        class="form-control mb-4"
        type="text"
        id="department-name"
        required
      />
      
      <button type="submit" class="form-control btn btn-primary mb-5">
        登録
      </button>
    </form>

    <RouterLink to="/departments" class="d-flex justify-content-evenly">
      部署リストへ
    </RouterLink>
  </div>
</template>
