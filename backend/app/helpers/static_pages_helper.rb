module StaticPagesHelper
  def search_card_information
    [
      {
        image_path: 'experiment.svg',
        card_title: '処理名で検索',
        card_text:  '処理名を入力して表面処理を検索します。',
        link_title: '検索ページへ',
        link_path:  category_name_path
      },
      {
        image_path: 'category.svg',
        card_title: 'カテゴリーで検索',
        card_text:  'カテゴリーを選択して表面処理を検索します。',
        link_title: '検索ページへ',
        link_path:  category_category_path
      },
      {
        image_path: 'factory.svg',
        card_title: 'メーカー名で検索',
        card_text:  'メーカー名を入力して表面処理を検索します。',
        link_title: '検索ページへ',
        link_path:  category_maker_path
      },
      {
        image_path: 'list.svg',
        card_title: '処理一覧から検索',
        card_text:  '表面処理一覧から目的の処理を検索します。',
        link_title: '検索ページへ',
        link_path:  samples_path }
    ]
  end

  def manage_card_information
    [
      {
        image_path: 'library_add.svg',
        card_title: '表面処理の管理',
        card_text:  '表面処理に関する情報を一括管理します。',
        link_title: '管理ページへ',
        link_path:  samples_path
      },
      {
        image_path: 'category_add.svg',
        card_title: 'カテゴリーの管理',
        card_text:  'カテゴリーに関する情報を一括管理します。',
        link_title: '管理ページへ',
        link_path:  categories_path
      },
      {
        image_path: 'maker_add.svg',
        card_title: 'メーカーの管理',
        card_text:  'メーカーに関する情報を一括管理します。',
        link_title: '管理ページへ',
        link_path:  makers_path
      },
      {
        image_path: 'user_add.svg',
        card_title: 'ユーザーの管理',
        card_text:  'ユーザーに関する情報を一括管理します。',
        link_title: '管理ページへ',
        link_path:  users_path
      }
    ]
  end

  def settings_card_information
    [
      {
        image_path: 'settings.svg',
        card_title: 'アプリケーションの管理',
        card_text:  'アプリケーションの設定やログアウトを行います。',
        link_title: '管理ページへ',
        link_path:  setting_path
      }
    ]
  end
end
