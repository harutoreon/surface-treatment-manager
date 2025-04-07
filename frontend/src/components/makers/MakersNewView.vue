<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">メーカー情報の登録</h3>

    <form action="/makers" accept-charset="UTF-8" method="post"><input type="hidden" name="authenticity_token" value="oBb2XYLck14ar9-bRmlv-2fFNBuu0-QvMb7CqBlFCLOAqrRsRvtJ3-MpYUaGO2US8jbJcCFiI_68xy04N3Inug" autocomplete="off" />
      <label class="form-label" for="maker_name">メーカー名</label>
      <input class="form-control mb-2" type="text" name="maker[name]" id="maker_name" />
      
      <label class="form-label" for="maker_postal_code">郵便番号</label>
      <input class="form-control mb-2" style="width: 10rem;" type="text" name="maker[postal_code]" id="maker_postal_code" />
      
      <label class="form-label" for="maker_address">住所</label>
      <input class="form-control mb-2" type="text" name="maker[address]" id="maker_address" />
      
      <label class="form-label" for="maker_phone_number">電話番号</label>
      <input class="form-control mb-2" style="width: 10rem;" type="tel" name="maker[phone_number]" id="maker_phone_number" />
      
      <label class="form-label" for="maker_fax_number">FAX番号</label>
      <input class="form-control mb-2" style="width: 10rem;" type="tel" name="maker[fax_number]" id="maker_fax_number" />
      
      <label class="form-label" for="maker_email">Email</label>
      <input class="form-control mb-2" type="email" name="maker[email]" id="maker_email" />
      
      <label class="form-label" for="maker_home_page">ホームページ</label>
      <input class="form-control mb-2" type="url" name="maker[home_page]" id="maker_home_page" />
      
      <label class="form-label" for="maker_manufacturer_rep">担当者</label>
      <input class="form-control mb-3" type="text" name="maker[manufacturer_rep]" id="maker_manufacturer_rep" />
      
      <button type="submit" class="form-control btn btn-primary mb-5">登録</button>
    </form>

    <div class="d-flex justify-content-center">
      <a href="/makers">メーカーリストへ</a>
    </div>
  </div>
</template>