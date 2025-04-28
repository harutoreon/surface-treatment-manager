<template>
  <div class="container w-25">
    <h3 class="text-center mt-5 mb-5">表面処理情報の登録</h3>

    <form>
      <label class="form-label" for="sample_name" id="label_sample_name">処理名</label>
      <input class="form-control mb-3" type="text" name="sample[name]" id="sample_name" />

      <label class="form-label" for="sample_category" id="label_sample_category">カテゴリー</label>

      <select class="form-select mb-3" name="sample[category]" id="sample_category">
        <option value=""></option>
        <option value="めっき">めっき</option>
        <option value="陽極酸化">陽極酸化</option>
        <option value="化成">化成</option>
        <option value="コーティング">コーティング</option>
        <option value="表面硬化">表面硬化</option>
      </select>

      <label class="form-label" for="sample_color" id="label_sample_color">色調</label>
      <input class="form-control mb-3" type="text" name="sample[color]" id="sample_color" />

      <label class="form-label" for="sample_maker" id="label_sample_maker">メーカー</label>
      <input class="form-control mb-3" type="text" name="sample[maker]" id="sample_maker" />

      <label class="form-label" for="sample_hardness" id="label_sample_hardness">硬度</label>
      <input class="form-control mb-3" type="text" name="sample[hardness]" id="sample_hardness" />

      <label class="form-label" for="sample_film_thickness" id="label_sample_film_thickness">膜厚</label>
      <input class="form-control mb-3" type="text" name="sample[film_thickness]" id="sample_film_thickness" />

      <label class="form-label" for="sample_feature" id="label_sample_feature">特徴</label>
      <input class="form-control mb-3" type="text" name="sample[feature]" id="sample_feature" />

      <label class="form-label" for="sample_picture" id="label_sample_picture">画像</label>
      <div><img alt="No Image" class="mb-3" id="preview_image" width="200" height="200" src="" /></div>
      <input class="form-control mb-4" accept="image/jpeg,image/gif,image/png,image/jpg" type="file" name="sample[picture]" id="sample_picture" />

      <button type="submit" class="form-control btn btn-primary mb-5">登録</button>
    </form>

    <div class="text-center mb-5">
      <a href="/samples">表面処理リストへ</a>
    </div>
  </div>

  <!-- <script type="text/javascript">
    document.getElementById('sample_picture').addEventListener('change', function() {
      let sizeInMegabytes = this.files[0].size / 1024 / 1024;
      if (sizeInMegabytes > 5) {
        alert('最大ファイルサイズは5MBです。より小さいファイルをお選びください。');
      }
    });

    document.getElementById('sample_picture').addEventListener('change', function() {
      let file = this.files[0];
      if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById('preview_image').setAttribute('src', e.target.result);
        }
        reader.readAsDataURL(file);
      }
    });
  </script> -->
</template>