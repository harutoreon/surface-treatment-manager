<template>
  <button
    type="button"
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#commentPostForm"
  >
    コメントの新規作成
  </button>

  <div
    class="modal fade"
    id="commentPostForm"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="commentPostFormLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1
            class="modal-title fs-5"
            id="commentPostFormLabel"
          >
            コメントの新規作成
          </h1>
        </div>
        <div class="modal-body">
          <textarea
            class="form-control"
            id="comment-post"
            placeholder="コメントはここに入力して下さい。"></textarea>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            閉じる
          </button>
          <button
            type="button"
            class="btn btn-primary"
          >
            リストに追加
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
