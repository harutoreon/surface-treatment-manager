<script setup>
import { ref } from 'vue'

const department = ref('')
const commenter = ref('')
const commentInput = ref('')
const comment = ref('')
const createdAt = ref('')

const handleCommentAdd = () => {
  department.value = '営業部'
  commenter.value = '佐藤 太郎'
  comment.value = commentInput.value
  createdAt.value = new Date().toISOString().slice(0, 10)
}
</script>

<template>
  <button
    type="button"
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#commentPostForm"
  >
    コメントの新規作成
  </button>

  <p
    class="mt-5"
  >
    部署: {{ department }}
  </p>
  <p>
    投稿者: {{ commenter }}
  </p>
  <p>
    コメント: {{ comment }}
  </p>
  <p>
    投稿日: {{ createdAt }}
  </p>

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
            v-model="commentInput"
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
            data-bs-dismiss="modal"
            v-on:click="handleCommentAdd"
          >
            リストに追加
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
