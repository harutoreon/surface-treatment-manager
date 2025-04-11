<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">メーカー情報の編集</h3>

    <!-- <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">{{ errorMessage }}</p> -->

    <!-- <form v-on:submit.prevent="makerRegistration"> -->
    <form>
      <label class="form-label" for="maker_name">メーカー名</label>
      <!-- <input v-model="name" class="form-control mb-2" type="text" id="maker_name" required/> -->
      <input class="form-control mb-2" type="text" id="maker_name"/>
      
      <label class="form-label" for="maker_postal_code">郵便番号</label>
      <!-- <input v-model="postalCode" class="form-control mb-2" style="width: 10rem;" type="text" id="maker_postal_code" /> -->
      <input class="form-control mb-2" style="width: 10rem;" type="text" id="maker_postal_code" />
      
      <label class="form-label" for="maker_address">住所</label>
      <!-- <input v-model="address" class="form-control mb-2" type="text" id="maker_address" /> -->
      <input class="form-control mb-2" type="text" id="maker_address" />
      
      <label class="form-label" for="maker_phone_number">電話番号</label>
      <!-- <input v-model="phoneNumber" class="form-control mb-2" style="width: 10rem;" type="tel" id="maker_phone_number" /> -->
      <input class="form-control mb-2" style="width: 10rem;" type="tel" id="maker_phone_number" />
      
      <label class="form-label" for="maker_fax_number">FAX番号</label>
      <!-- <input v-model="faxNumber" class="form-control mb-2" style="width: 10rem;" type="tel" id="maker_fax_number" /> -->
      <input class="form-control mb-2" style="width: 10rem;" type="tel" id="maker_fax_number" />
      
      <label class="form-label" for="maker_email">Email</label>
      <!-- <input v-model="email" class="form-control mb-2" type="email" id="maker_email" /> -->
      <input class="form-control mb-2" type="email" id="maker_email" />
      
      <label class="form-label" for="maker_home_page">ホームページ</label>
      <!-- <input v-model="homePage" class="form-control mb-2" type="url" id="maker_home_page" /> -->
      <input class="form-control mb-2" type="url" id="maker_home_page" />
      
      <label class="form-label" for="maker_manufacturer_rep">担当者</label>
      <!-- <input v-model="manufacturerRep" class="form-control mb-3" type="text" id="maker_manufacturer_rep"/> -->
      <input class="form-control mb-3" type="text" id="maker_manufacturer_rep"/>
      
      <button type="submit" class="form-control btn btn-primary mb-5">更新</button>
    </form>

    <div class="d-flex justify-content-center">
      <!-- <RouterLink to="/makers">メーカーリストへ</RouterLink> -->
      <a>メーカーリストへ</a>
    </div>
  </div>
</template>