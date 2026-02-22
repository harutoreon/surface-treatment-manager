Faker::Config.locale = "ja"

# 部署名の生成

DEPARTMENTS = [
  '品質管理部',
  '製造部',
  '開発部',
  '営業部'
]

DEPARTMENTS.each do |name|
  Department.create!(name: name)
end


# サンプルユーザー・管理者ユーザー・一般ユーザーの生成

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


# カテゴリーの生成

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


# メーカーの生成

MAKERS = [
  {
    name: "東亜電化工業株式会社",
    postal_code: "910-0845",
    address: "山口県西悠斗町1-2-1",
    phone_number: "070-8007-8335",
    fax_number: "080-4377-8360",
    email: "sample_maker1@example.com",
    home_page: "https://touadenka.example.com/",
    manufacturer_rep: "橋本 愛",
  },
  {
    name: "新星コーティングス",
    postal_code: "602-8016",
    address: "千葉県岡田郡1-2-2",
    phone_number: "090-1965-9056",
    fax_number: "070-1054-2902",
    email: "sample_maker2@example.com",
    home_page: "https://sinsei.example.com/",
    manufacturer_rep: "上野 美穂",
  },
  {
    name: "大和表面技術研究所",
    postal_code: "350-1145",
    address: "沖縄県南山本郡1-2-3",
    phone_number: "070-7325-6366",
    fax_number: "070-8648-5423",
    email: "sample_maker3@example.com",
    home_page: "https://yamato.example.com/",
    manufacturer_rep: "大野 裕子",
  },
  {
    name: "中央メッキ技研",
    postal_code: "100-6928",
    address: "栃木県小斉藤村1-2-4",
    phone_number: "070-9841-8413",
    fax_number: "090-3111-6425",
    email: "sample_maker4@example.com",
    home_page: "https://tyuoumeki.example.com/",
    manufacturer_rep: "小川 裕子",
  },
  {
    name: "サンエース・フィニッシュ",
    postal_code: "558-0022",
    address: "福井県西愛美市1-2-5",
    phone_number: "080-4293-1186",
    fax_number: "080-2807-8946",
    email: "sample_maker5@example.com",
    home_page: "https://sane-su.example.com/",
    manufacturer_rep: "山口 彩",
  },
  {
    name: "瑞穂皮膜加工",
    postal_code: "481-0037",
    address: "鹿児島県中颯村1-2-6",
    phone_number: "070-7419-9965",
    fax_number: "090-6092-6283",
    email: "sample_maker6@example.com",
    home_page: "https://mizuho.example.com/",
    manufacturer_rep: "安藤 さくら",
  },
  {
    name: "アストロ産業",
    postal_code: "879-7143",
    address: "東京都結菜市1-2-7",
    phone_number: "080-4979-5274",
    fax_number: "090-9973-2745",
    email: "sample_maker7@example.com",
    home_page: "https://astoro.example.com/",
    manufacturer_rep: "石田 彩乃",
  },
  {
    name: "明和サーフェス",
    postal_code: "460-0006",
    address: "  北海道南樹市1-2-8",
    phone_number: "090-1998-7298",
    fax_number: "070-5905-6674",
    email: "sample_maker8@example.com",
    home_page: "https://meiwa.example.com/",
    manufacturer_rep: "内田 樹",
  },
  {
    name: "富士理化研磨株式会社",
    postal_code: "378-0051",
    address: "岩手県東石田村1-2-9",
    phone_number: "070-1963-1060",
    fax_number: "070-2031-1932",
    email: "sample_maker9@example.com",
    home_page: "https://fuzirika.example.com/",
    manufacturer_rep: "中島 大和",
  },
  {
    name: "高周波サーマル工業",
    postal_code: "616-8286",
    address: "埼玉県新恵郡1-2-10",
    phone_number: "080-9785-1973",
    fax_number: "080-6435-2250",
    email: "sample_maker10@example.com",
    home_page: "https://sa-maru.example.com/",
    manufacturer_rep: "岡本 優斗",
  },
]

MAKERS.each do |maker|
  Maker.create!(name: maker[:name],
                postal_code: maker[:postal_code],
                address: maker[:address],
                phone_number: maker[:phone_number],
                fax_number: maker[:fax_number],
                email: maker[:email],
                home_page: maker[:home_page],
                manufacturer_rep: maker[:manufacturer_rep])
end


# サンプルの生成

plating = Category.find_by(item: 'めっき')
anodizing = Category.find_by(item: '陽極酸化')
conversion_coating = Category.find_by(item: '化成')
coating = Category.find_by(item: 'コーティング')
surface_hardening = Category.find_by(item: '表面硬化')

SAMPLES = [
  { name: "無電解ニッケルめっき",
    color: "イエローブラウンシルバー",
    hardness: "析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度",
    film_thickness: "通常は3～5μm、厚めの場合は20～50μmまで可能",
    feature: "耐食性・耐摩耗性・耐薬品性・耐熱性",
    image_file: "electroless_nickel_plating",
    summary: '電気を使わず化学反応で金属表面にニッケルを析出する技術です。',
    category_id: plating.id },

  { name: "白金めっき",
    color: "シルバー",
    hardness: "Hv300～Hv400程度",
    film_thickness: "水素水生成器用の白金電極では0.5～2.0μm、装飾品では0.1～0.5μm程度",
    feature: "耐蝕性・導電性・耐摩耗性・耐熱性",
    image_file: "white_silver_plating",
    summary: '白金を電気めっきや化学めっきで表面に薄く被覆する技術です。',
    category_id: plating.id },

  { name: "金めっき",
    color: "ゴールド",
    hardness: "HV60～80程度",
    film_thickness: "下地ニッケルめっきは3～5μm、金めっきは0.1～1.0μm",
    feature: "耐食性・耐酸化性・電気抵抗性",
    image_file: "gold_plate",
    summary: '金を電気めっきや化学めっきで表面に薄く被覆する技術です。',
    category_id: plating.id },

  { name: "銀めっき",
    color: "シルバー",
    hardness: "HV60～80程度",
    film_thickness: "0.1～3μm程度",
    feature: "耐摩耗性・潤滑性・耐食性・導電性",
    image_file: "silver_plating",
    summary: '銀を電気めっきや化学めっきで表面に薄く被覆する技術です。',
    category_id: plating.id },

  { name: "銅めっき",
    color: "ブロンズ",
    hardness: "無光沢でHv80～120、光沢でHv80～200程度",
    film_thickness: "0.2～2μm程度",
    feature: "抗菌性・密着性",
    image_file: "copper_plating",
    summary: '銅を電気めっきや化学めっきで表面に薄く被覆する技術です。',
    category_id: plating.id },

  { name: "亜鉛めっき",
    color: "シルバー",
    hardness: "シアン浴でHv60～90、ジンケート浴でHv100～140、塩化浴でHv60～90",
    film_thickness: "5～20μm程度",
    feature: "耐食性・耐腐食性・密着性",
    image_file: "zinc_plating",
    summary: '亜鉛を電気めっきや溶融めっきで表面に被覆する技術です。',
    category_id: plating.id },

  { name: "錫めっき",
    color: "ホワイトシルバー",
    hardness: "Hv9.5～10.5程度",
    film_thickness: "光沢スズめっきで3～10μm、無光沢スズめっきで5～20μm程度",
    feature: "耐食性・潤滑性・摺動性",
    image_file: "tin_plating",
    summary: '錫を電気めっきや化学めっきで表面に薄く被覆する技術です。',
    category_id: plating.id },

  { name: "ニッケルめっき",
    color: "ライトシルバー",
    hardness: "Hv350 ～500程度",
    film_thickness: "3～30μm程度",
    feature: "耐食性・耐薬品性・耐熱性",
    image_file: "nickel_plating",
    summary: 'ニッケルを電気めっきや化学めっきで表面に被覆する技術です。',
    category_id: plating.id },

  { name: "クロムめっき",
    color: "シルバー",
    hardness: "Hv700～1,000程度",
    film_thickness: "0.1～0.2μm程度",
    feature: "耐食性・耐摩耗性・耐衝撃性",
    image_file: "chrome_plating",
    summary: 'クロムを電気めっきで表面に薄く被覆する技術です。',
    category_id: plating.id },

  { name: "黒色クロムめっき",
    color: "マットブラック",
    hardness: "装飾用でHv550～640、工業用でHv800～1,000程度",
    film_thickness: "3～8μm程度",
    feature: "低反射性・熱吸収性・導電性・耐食性",
    image_file: "black_chrome_plating",
    summary: '黒色のクロム皮膜を電気めっきで表面に形成する技術です。',
    category_id: plating.id },

  { name: "レイデント",
    color: "ブラック",
    hardness: "Hv350程度",
    film_thickness: "1～2μm程度",
    feature: "薄膜性・防錆性・光学特性・装飾性",
    image_file: "raident",
    summary: '表面に微細凹凸を付与し摩擦特性や耐摩耗性を向上する技術です。',
    category_id: plating.id },

  { name: "白アルマイト",
    color: "ホワイト",
    hardness: "Hv200程度",
    film_thickness: "6～10µm程度",
    feature: "耐摩耗性・耐電圧性",
    image_file: "white_anodized_aluminum",
    summary: 'アルミ表面に白色の酸化皮膜を生成する表面処理技術です。',
    category_id: anodizing.id },

  { name: "黒アルマイト",
    color: "ブラック",
    hardness: "Hv200程度",
    film_thickness: "5～20μm程度",
    feature: "反射防止性・熱伝導性・光選択吸収性",
    image_file: "black_anodized_aluminum",
    summary: 'アルミ表面に黒色の酸化皮膜を生成する表面処理技術です。',
    category_id: anodizing.id },

  { name: "硬質アルマイト",
    color: "ダークブラウン",
    hardness: "Hv450〜500程度",
    film_thickness: "20〜30μm程度",
    feature: "耐摩耗性",
    image_file: "hard_anodized_aluminum",
    summary: 'アルミ表面に硬く耐摩耗性の高い酸化皮膜を形成する技術です。',
    category_id: anodizing.id },

  { name: "ユニクロクロメート",
    color: "シルバー",
    hardness: "Hv70～100程度",
    film_thickness: "0.1～0.3μｍ程度",
    feature: "耐食性・耐摩耗性・導電性・潤滑性",
    image_file: "unichromate",
    summary: '亜鉛めっき後に防錆性のクロメート皮膜を付与する技術です。',
    category_id: conversion_coating.id },

  { name: "有色クロメート",
    color: "イエローブラウン",
    hardness: "Hv70～100程度",
    film_thickness: "0.1～0.3μｍ程度",
    feature: "耐食性・耐摩耗性・導電性・潤滑性",
    image_file: "colored_chromate",
    summary: '亜鉛めっきや鋼に着色クロメート皮膜を形成する技術です。',
    category_id: conversion_coating.id },

  { name: "黒クロメート",
    color: "ブラック",
    hardness: "0.1～0.3μｍ程度",
    film_thickness: "Hv70～100程度",
    feature: "耐食性・耐摩耗性・導電性・潤滑性",
    image_file: "black_chromate",
    summary: '亜鉛めっきや鋼に黒色クロメート皮膜を形成する技術です。',
    category_id: conversion_coating.id },

  { name: "緑クロメート",
    color: "オリーブ",
    hardness: "Hv70～100程度",
    film_thickness: "0.1～0.3μｍ程度",
    feature: "耐食性・耐摩耗性・導電性・潤滑性",
    image_file: "green_chromate",
    summary: '亜鉛めっきや鋼に緑色クロメート皮膜を形成する技術です。',
    category_id: conversion_coating.id },

  { name: "四三酸化鉄皮膜",
    color: "ブラック",
    hardness: "対象外",
    film_thickness: "0.2〜1μm",
    feature: "装飾性・反射防止",
    image_file: "iron_tetroxide_film",
    summary: '鉄表面に四三酸化鉄の防錆皮膜を形成する技術です。',
    category_id: conversion_coating.id },

  { name: "パーカー",
    color: "ブラック",
    hardness: "Hv400～1300程度",
    film_thickness: "1～20μm程度",
    feature: "耐摩耗性・密着性・耐食性・耐熱性",
    image_file: "hooded sweatshirt",
    summary: '鉄鋼表面にリン酸塩皮膜を形成し防錆・塗装性向上する技術です。',
    category_id: conversion_coating.id },

  { name: "TiN",
    color: "ゴールド",
    hardness: "Hv2000程度",
    film_thickness: "2～4μm程度",
    feature: "耐摩耗性・離型性",
    image_file: "titanium_coating",
    summary: 'チタン窒化物の硬質薄膜を表面に形成するコーティング技術です。',
    category_id: coating.id },

  { name: "TiCN",
    color: "グレー",
    hardness: "Hv3000～4000程度",
    film_thickness: "2μm",
    feature: "耐摩耗性・耐食性・耐熱性",
    image_file: "titanium_ceramic_coating",
    summary: 'チタン炭窒化物の硬質薄膜を表面に形成するコーティング技術です。',
    category_id: coating.id },

  { name: "TiAlN",
    color: "ダークバイオレット",
    hardness: "Hv2400～2600程度",
    film_thickness: "2～4µm程度",
    feature: "耐熱性・耐酸化性・耐摩耗性・",
    image_file: "titanium_aluminum_coating",
    summary: 'チタンアルミ窒化物の硬質薄膜を表面に形成するコーティング技術です。',
    category_id: coating.id },

  { name: "AlCrN",
    color: "ダークグレー",
    hardness: "Hv2000～2500程度",
    film_thickness: "3～5μm程度",
    feature: "耐摩耗性・耐熱性",
    image_file: "aluminum_chrome_coating",
    summary: 'アルミクロム窒化物の硬質薄膜を表面に形成するコーティング技術です。',
    category_id: coating.id },

  { name: "CrN",
    color: "シルバーグレー",
    hardness: "Hv1800程度",
    film_thickness: "2～4μm程度",
    feature: "耐摩耗性・耐食性・潤滑性・耐熱性",
    image_file: "chromium_nitride_coating",
    summary: 'クロム窒化物の硬質薄膜を表面に形成するコーティング技術です。',
    category_id: coating.id },

  { name: "DLC",
    color: "ブラック",
    hardness: "Hv3000～6000程度",
    film_thickness: "1～3μm程度",
    feature: "耐摩耗性・摺動性・耐食性",
    image_file: "diamond_like_carbon",
    summary: 'ダイヤモンドのような炭素膜を表面に形成する摩耗防止コーティング技術です。',
    category_id: coating.id },

  { name: "ブラスト",
    color: "メタリックグレー",
    hardness: "対象外",
    film_thickness: "対象外",
    feature: "耐摩耗性・摺動性・潤滑性",
    image_file: "blast",
    summary: '研磨材を噴射して表面を清浄・粗面化する表面処理技術です。',
    category_id: surface_hardening.id },

  { name: "WPC",
    color: "グレー",
    hardness: "対象外",
    film_thickness: "対象外",
    feature: "耐摩耗性・摺動性・潤滑性",
    image_file: "wonder_process_craft",
    summary: '微細衝撃加工で金属表面を強化し耐疲労性を高める技術です。',
    category_id: surface_hardening.id },

  { name: "パルソナイト",
    color: "グレー",
    hardness: "表面硬度は炭素鋼Hv400〜500程度、ステンレス材でHv900程度",
    film_thickness: "3～10μm程度",
    feature: "耐食性・耐摩耗性・平滑性",
    image_file: "palsonite",
    summary: '金属表面に微細凹凸を付与し耐摩耗性を向上させる技術です。',
    category_id: surface_hardening.id },

  { name: "タフトライド",
    color: "グレー",
    hardness: "Hv570前後",
    film_thickness: "0.01～0.3μm程度",
    feature: "耐摩耗性、耐疲労性、耐食性、耐かじり性",
    image_file: "tufted_ride",
    summary: '金属表面に硬質被膜を形成し耐摩耗性を向上させる技術です。',
    category_id: surface_hardening.id },

  { name: "キリンコートS",
    color: "メタリックグレー",
    hardness: "表面硬度はHv400～1300程度",
    film_thickness: "0.01～0.04μm程度",
    feature: "平滑性・耐摩耗性・密着性",
    image_file: "kirin_coat_s",
    summary: '金属表面に耐摩耗・耐腐食性コーティングを施す技術です。',
    category_id: surface_hardening.id },

  { name: "カナック",
    color: "ブラウン",
    hardness: "Hv800～1400程度",
    film_thickness: "寸法変化は0～5µm程度",
    feature: "耐食性・耐熱性・摺動性",
    image_file: "canac",
    summary: '金属表面に耐摩耗性と防錆性を付与するコーティング技術です。',
    category_id: surface_hardening.id },
]

def create_sample(id, sample)
  Maker.find(id).samples.create!(
    name: sample[:name],
    color: sample[:color],
    hardness: sample[:hardness],
    film_thickness: sample[:film_thickness],
    feature: sample[:feature],
    image: File.open("app/assets/images/#{sample[:image_file]}.jpeg"),
    summary: sample[:summary],
    category_id: sample[:category_id],
  )
end

SAMPLES[0..2].each do |sample|
  create_sample(1, sample)
end

SAMPLES[3..5].each do |sample|
  create_sample(2, sample)
end

SAMPLES[6..8].each do |sample|
  create_sample(3, sample)
end

SAMPLES[9..11].each do |sample|
  create_sample(4, sample)
end

SAMPLES[12..14].each do |sample|
  create_sample(5, sample)
end

SAMPLES[15..17].each do |sample|
  create_sample(6, sample)
end

SAMPLES[18..20].each do |sample|
  create_sample(7, sample)
end

SAMPLES[21..23].each do |sample|
  create_sample(8, sample)
end

SAMPLES[24..26].each do |sample|
  create_sample(9, sample)
end

SAMPLES[27..32].each do |sample|
  create_sample(10, sample)
end


# コメントの生成

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

# コメントの新規作成

treatment_list = Sample.order(:id)
users = User.where(id: 1..48)  # id:49 の admin user と id:50 の general user は取得対象外

5.times do
  treatment_list.each do |treatment|
    user = users.sample
    treatment.comments.create!(commenter: user.name, department: user.department, body: SAMPLE_COMMENT.sample, user_id: user.id)
  end
end
