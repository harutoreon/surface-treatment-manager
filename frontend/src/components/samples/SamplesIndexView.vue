<template>
  <div class="container text-center w-50">
    <h3 class="mt-5 mb-5">表面処理リスト</h3>

    <div class="list-group list-group-flush mb-2">
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6 id="label_name_and_category">処理名 / カテゴリー</h6>
          <h6 id="label_maker_name">メーカー名</h6>
        </div>
      </div>

      <a class="list-group-item list-group-item-action" href="/samples/#">
        <div class="d-flex w-100 justify-content-between">
          <h6>無電解ニッケルめっき</h6>
          <h6>合名会社西村ガス</h6>
        </div>
        <h6 class="text-start">めっき</h6>
      </a>
    
      <a class="list-group-item list-group-item-action" href="/samples/#">
        <div class="d-flex w-100 justify-content-between">
          <h6>白金めっき</h6>
          <h6>合同会社山口運輸</h6>
        </div>
        <h6 class="text-start">めっき</h6>
      </a>
    
      <a class="list-group-item list-group-item-action" href="/samples/#">
        <div class="d-flex w-100 justify-content-between">
          <h6>金めっき</h6>
          <h6>藤本情報株式会社</h6>
        </div>
        <h6 class="text-start">めっき</h6>
      </a>
    
      <a class="list-group-item list-group-item-action" href="/samples/#">
        <div class="d-flex w-100 justify-content-between">
          <h6>銀めっき</h6>
          <h6>岩崎通信株式会社</h6>
        </div>
        <h6 class="text-start">めっき</h6>
      </a>
      
      <a class="list-group-item list-group-item-action" href="/samples/#">
        <div class="d-flex w-100 justify-content-between">
          <h6>銅めっき</h6>
          <h6>合同会社高木印刷</h6>
        </div>
        <h6 class="text-start">めっき</h6>
      </a>
      
      <a class="list-group-item list-group-item-action" href="/samples/#">
        <div class="d-flex w-100 justify-content-between">
          <h6>亜鉛めっき</h6>
          <h6>株式会社後藤運輸</h6>
        </div>
        <h6 class="text-start">めっき</h6>
      </a>
      
      <a class="list-group-item list-group-item-action" href="/samples/#">
        <div class="d-flex w-100 justify-content-between">
          <h6>錫めっき</h6>
          <h6>上田鉱業合同会社</h6>
        </div>
        <h6 class="text-start">めっき</h6>
      </a>
      
      <a class="list-group-item list-group-item-action" href="/samples/#">
        <div class="d-flex w-100 justify-content-between">
          <h6>ニッケルめっき</h6>
          <h6>宮本食品合同会社</h6>
        </div>
        <h6 class="text-start">めっき</h6>
      </a>
    </div>

    <ul class="pagination justify-content-center mb-5">
      <li class="page-item disabled">
        <a class="page-link" id="previous_page">前のページ</a>
      </li>
      <li class="page-item active">
        <a class="page-link" href="/samples?page=#">1</a>
      </li>
      <li class="page-item ">
        <a class="page-link" href="/samples?page=#">2</a>
      </li>
      <li class="page-item ">
        <a class="page-link" href="/samples?page=#">3</a>
      </li>
      <li class="page-item ">
        <a class="page-link" href="/samples?page=#">4</a>
      </li>
      <li class="page-item">
        <a class="page-link" id="next_page" href="/samples?page=#">次のページ</a>
      </li>
    </ul>

    <div class="d-flex justify-content-evenly">
      <a href="/samples/new">表面処理情報の登録</a>
      <a href="/home">メインメニューへ</a>
    </div>
  </div>
</template>
