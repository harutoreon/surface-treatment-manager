Faker::Config.locale = "ja"

DEPARTMENTS = [
  '品質管理部',
  '製造部',
  '開発部',
  '営業部'
]

48.times do
  name = Faker::Name.name
  department = DEPARTMENTS.sample
  password = "password"
  User.create!(name: name,
               department: department,
               password: password,
               password_confirmation: password)
end

User.create!(name: "admin user", department: "品質管理部", password: "adminpassword", password_confirmation: "adminpassword", admin: true)
User.create!(name: "general user", department: "開発部", password: "generalpassword", password_confirmation: "generalpassword")

CATEGORIES = {
  "めっき" => "金属または非金属の材料の表面に金属の薄膜を被覆する処理のこと。",
  "陽極酸化" => "人工的にアルミニウム表面に分厚い酸化アルミニウム被膜を作る処理のこと。",
  "化成" => "金属の表面に処理剤を作用させて化学反応を起こさせる処理のこと。",
  "コーティング" => "溶射金属やセラミックスの粉末を、溶解状態にして製品表面に吹き付ける処理のこと。",
  "表面硬化" => "主に金属材料に対して行われる、加熱・冷却・雰囲気により材料の性質を変化させる処理のこと。"
}

CATEGORIES.each do |item, summary|
  Category.create!(item: item, summary: summary)
end

SAMPLES = [
  { name: "無電解ニッケルめっき",
    category: "めっき",
    color: "イエローブラウンシルバー",
    hardness: "析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度",
    film_thickness: "通常は3～5μm、厚めの場合は20～50μmまで可能",
    feature: "耐食性・耐摩耗性・耐薬品性・耐熱性",
    image_file: "electroless_nickel_plating" },

  { name: "白金めっき",
    category: "めっき",
    color: "シルバー",
    hardness: "Hv300～Hv400程度",
    film_thickness: "水素水生成器用の白金電極では0.5～2.0μm、装飾品では0.1～0.5μm程度",
    feature: "耐蝕性・導電性・耐摩耗性・耐熱性",
    image_file: "white_silver_plating" },

  { name: "金めっき",
    category: "めっき",
    color: "ゴールド",
    hardness: "HV60～80程度",
    film_thickness: "下地ニッケルめっきは3～5μm、金めっきは0.1～1.0μm",
    feature: "耐食性・耐酸化性・電気抵抗性",
    image_file: "gold_plate" },

  { name: "銀めっき",
    category: "めっき",
    color: "シルバー",
    hardness: "HV60～80程度",
    film_thickness: "0.1～3μm程度",
    feature: "耐摩耗性・潤滑性・耐食性・導電性",
    image_file: "silver_plating" },

  { name: "銅めっき",
    category: "めっき",
    color: "ブロンズ",
    hardness: "無光沢でHv80～120、光沢でHv80～200程度",
    film_thickness: "0.2～2μm程度",
    feature: "抗菌性・密着性",
    image_file: "copper_plating" },

  { name: "亜鉛めっき",
    category: "めっき",
    color: "シルバー",
    hardness: "シアン浴でHv60～90、ジンケート浴でHv100～140、塩化浴でHv60～90",
    film_thickness: "5～20μm程度",
    feature: "耐食性・耐腐食性・密着性",
    image_file: "zinc_plating" },

  { name: "錫めっき",
    category: "めっき",
    color: "ホワイトシルバー",
    hardness: "Hv9.5～10.5程度",
    film_thickness: "光沢スズめっきで3～10μm、無光沢スズめっきで5～20μm程度",
    feature: "耐食性・潤滑性・摺動性",
    image_file: "tin_plating" },

  { name: "ニッケルめっき",
    category: "めっき",
    color: "ライトシルバー",
    hardness: "Hv350 ～500程度",
    film_thickness: "3～30μm程度",
    feature: "耐食性・耐薬品性・耐熱性",
    image_file: "nickel_plating" },

  { name: "クロムめっき",
    category: "めっき",
    color: "シルバー",
    hardness: "Hv700～1,000程度",
    film_thickness: "0.1～0.2μm程度",
    feature: "耐食性・耐摩耗性・耐衝撃性",
    image_file: "chrome_plating" },

  { name: "黒色クロムめっき",
    category: "めっき",
    color: "マットブラック",
    hardness: "装飾用でHv550～640、工業用でHv800～1,000程度",
    film_thickness: "3～8μm程度",
    feature: "低反射性・熱吸収性・導電性・耐食性",
    image_file: "black_chrome_plating" },

  { name: "白アルマイト",
    category: "陽極酸化",
    color: "ホワイト",
    hardness: "Hv200程度",
    film_thickness: "6～10µm程度",
    feature: "耐摩耗性・耐電圧性",
    image_file: "white_anodized_aluminum" },

  { name: "黒アルマイト",
    category: "陽極酸化",
    color: "ブラック",
    hardness: "Hv200程度",
    film_thickness: "5～20μm程度",
    feature: "反射防止性・熱伝導性・光選択吸収性",
    image_file: "black_anodized_aluminum" },

  { name: "硬質アルマイト",
    category: "陽極酸化",
    color: "ダークブラウン",
    hardness: "Hv450〜500程度",
    film_thickness: "20〜30μm程度",
    feature: "耐摩耗性",
    image_file: "hard_anodized_aluminum" },

  { name: "ユニクロクロメート",
    category: "化成",
    color: "シルバー",
    hardness: "Hv70～100程度",
    film_thickness: "0.1～0.3μｍ程度",
    feature: "耐食性・耐摩耗性・導電性・潤滑性",
    image_file: "unichromate" },

  { name: "有色クロメート",
    category: "化成",
    color: "イエローブラウン",
    hardness: "Hv70～100程度",
    film_thickness: "0.1～0.3μｍ程度",
    feature: "耐食性・耐摩耗性・導電性・潤滑性",
    image_file: "colored_chromate" },

  { name: "黒クロメート",
    category: "化成",
    color: "ブラック",
    hardness: "0.1～0.3μｍ程度",
    film_thickness: "Hv70～100程度",
    feature: "耐食性・耐摩耗性・導電性・潤滑性",
    image_file: "black_chromate" },

  { name: "緑クロメート",
    category: "化成",
    color: "オリーブ",
    hardness: "Hv70～100程度",
    film_thickness: "0.1～0.3μｍ程度",
    feature: "耐食性・耐摩耗性・導電性・潤滑性",
    image_file: "green_chromate" },

  { name: "四三酸化鉄皮膜",
    category: "化成",
    color: "ブラック",
    hardness: "対象外",
    film_thickness: "0.2〜1μm",
    feature: "装飾性・反射防止",
    image_file: "iron_tetroxide_film" },

  { name: "パーカー",
    category: "化成",
    color: "ブラック",
    hardness: "Hv400～1300程度",
    film_thickness: "1～20μm程度",
    feature: "耐摩耗性・密着性・耐食性・耐熱性",
    image_file: "hooded sweatshirt" },

  { name: "TiN",
    category: "コーティング",
    color: "ゴールド",
    hardness: "Hv2000程度",
    film_thickness: "2～4μm程度",
    feature: "耐摩耗性・離型性",
    image_file: "titanium_coating" },

  { name: "TiCN",
    category: "コーティング",
    color: "グレー",
    hardness: "Hv3000～4000程度",
    film_thickness: "2μm",
    feature: "耐摩耗性・耐食性・耐熱性",
    image_file: "titanium_ceramic_coating" },

  { name: "TiAlN",
    category: "コーティング",
    color: "ダークバイオレット",
    hardness: "Hv2400～2600程度",
    film_thickness: "2～4µm程度",
    feature: "耐熱性・耐酸化性・耐摩耗性・",
    image_file: "titanium_aluminum_coating" },

  { name: "AlCrN",
    category: "コーティング",
    color: "ダークグレー",
    hardness: "Hv2000～2500程度",
    film_thickness: "3～5μm程度",
    feature: "耐摩耗性・耐熱性",
    image_file: "aluminum_chrome_coating" },

  { name: "CrN",
    category: "コーティング",
    color: "シルバーグレー",
    hardness: "Hv1800程度",
    film_thickness: "2～4μm程度",
    feature: "耐摩耗性・耐食性・潤滑性・耐熱性",
    image_file: "chromium_nitride_coating" },

  { name: "DLC",
    category: "コーティング",
    color: "ブラック",
    hardness: "Hv3000～6000程度",
    film_thickness: "1～3μm程度",
    feature: "耐摩耗性・摺動性・耐食性",
    image_file: "diamond_like_carbon" },

  { name: "ブラスト",
    category: "表面硬化",
    color: "メタリックグレー",
    hardness: "対象外",
    film_thickness: "対象外",
    feature: "耐摩耗性・摺動性・潤滑性",
    image_file: "blast" },

  { name: "WPC",
    category: "表面硬化",
    color: "グレー",
    hardness: "対象外",
    film_thickness: "対象外",
    feature: "耐摩耗性・摺動性・潤滑性",
    image_file: "wonder_process_craft" },

  { name: "レイデント",
    category: "めっき",
    color: "ブラック",
    hardness: "Hv350程度",
    film_thickness: "1～2μm程度",
    feature: "薄膜性・防錆性・光学特性・装飾性",
    image_file: "raident" },

  { name: "パルソナイト",
    category: "表面硬化",
    color: "グレー",
    hardness: "表面硬度は炭素鋼Hv400〜500程度、ステンレス材でHv900程度",
    film_thickness: "3～10μm程度",
    feature: "耐食性・耐摩耗性・平滑性",
    image_file: "palsonite" },

  { name: "タフトライド",
    category: "表面硬化",
    color: "グレー",
    hardness: "Hv570前後",
    film_thickness: "0.01～0.3μm程度",
    feature: "耐摩耗性、耐疲労性、耐食性、耐かじり性",
    image_file: "tufted_ride" },

  { name: "キリンコートS",
    category: "表面硬化",
    color: "メタリックグレー",
    hardness: "表面硬度はHv400～1300程度",
    film_thickness: "0.01～0.04μm程度",
    feature: "平滑性・耐摩耗性・密着性",
    image_file: "kirin_coat_s" },

  { name: "カナック",
    category: "表面硬化",
    color: "ブラウン",
    hardness: "Hv800～1400程度",
    film_thickness: "寸法変化は0～5µm程度",
    feature: "耐食性・耐熱性・摺動性",
    image_file: "canac" }
]

SAMPLES.each do |sample|
  Sample.create!(name: sample[:name],
                 category: sample[:category],
                 color: sample[:color],
                 maker: Faker::Company.name,
                 hardness: sample[:hardness],
                 film_thickness: sample[:film_thickness],
                 feature: sample[:feature],
                 image: File.open("app/assets/images/#{sample[:image_file]}.jpeg"))
end

100.times do |n|
  Maker.create!(name: Faker::Company.name,
                postal_code: Faker::Address.postcode,
                address: "東京都渋谷区神南1-2-#{n}",
                phone_number: Faker::PhoneNumber.cell_phone,
                fax_number: Faker::PhoneNumber.cell_phone,
                email: "sample_maker#{n}@example.com",
                home_page: "https://example.com/sample_maker#{n}",
                manufacturer_rep: Faker::Name.name)
end

SAMPLE_COMMENT = [
  "耐摩耗性が高く、使用頻度の高い部分でも長持ちしています。",
  "仕上がりが均一で、見栄えが非常に良いです。",
  "表面の光沢が持続しており、美観が保たれています。",
  "コーティングが均一に施されており、凹凸が感じられません。",
  "防錆効果が高く、錆びが発生していません。",
  "めっきの厚みがちょうど良く、耐久性が感じられます。",
  "表面処理がしっかりしているので、指紋や汚れが付きにくいです。",
  "製品に高級感を与える仕上がりで、見た目も美しいです。",
  "コーティングが施されているため、滑りが良く、操作性が向上しています。",
  "耐薬品性が優れており、清掃も容易です。",
  "表面の摩耗が少なく、長期間使用できます。",
  "環境条件に強く、屋外でも変色がほとんどありません。",
  "コーティングの厚みが均一で、光の反射が美しいです。",
  "表面処理により耐熱性が向上し、高温環境でも問題ありません。",
  "防水性が向上しており、水や湿気に強いです。",
  "表面の質感が滑らかで、触感が良好です。",
  "耐久性が高く、長期間の使用に耐えられる仕上がりです。",
  "コーティングにより、酸化が抑えられています。",
  "表面が美しく輝いており、品質感が増しています。",
  "めっき処理が均一で、気泡や不純物がありません。",
  "表面が非常に硬く、傷がつきにくいです。",
  "防湿性が高く、湿気の影響を受けにくいです。",
  "処理後の色の均一性が高く、ムラがありません。",
  "コーティングにより摩擦が少なく、稼働が滑らかです。",
  "表面の光沢感が上品で、高級感を感じさせます。",
  "耐腐食性が高く、化学物質に強い仕上がりです。",
  "防汚性があり、汚れが落ちやすいです。",
  "長期間使用してもくすみや変色がありません。",
  "表面の硬度が向上しており、日常使用での劣化が少ないです。",
  "コーティングの透明度が高く、基材の色が映える仕上がりです。"
]

treatment_list = Sample.all
users = User.where(id: 1..48)  # id:49 の admin user と id:50 の general user は除く
user_name = users.map { |user| user.name}
department = DEPARTMENTS

5.times do
  treatment_list.each do |treatment|
    treatment.comments.create!(commenter: user_name.sample, department: department.sample, body: SAMPLE_COMMENT.sample)
  end
end
