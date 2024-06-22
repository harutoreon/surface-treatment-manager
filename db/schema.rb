ActiveRecord::Schema[7.1].define(version: 2024_05_06_122133) do
  enable_extension "plpgsql"

  create_table "categories", force: :cascade do |t|
    t.string "item"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "summary"
  end

  create_table "comments", force: :cascade do |t|
    t.string "commenter"
    t.text "body"
    t.bigint "sample_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["sample_id"], name: "index_comments_on_sample_id"
  end

  create_table "makers", force: :cascade do |t|
    t.string "name"
    t.string "postal_code"
    t.string "address"
    t.string "phone_number"
    t.string "fax_number"
    t.string "email"
    t.string "home_page"
    t.string "manufacturer_rep"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "samples", force: :cascade do |t|
    t.string "name"
    t.string "category"
    t.string "color"
    t.string "maker"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "picture"
    t.string "hardness"
    t.string "film_thickness"
    t.string "feature"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.boolean "admin", default: false
    t.index ["name"], name: "index_users_on_name"
  end

  add_foreign_key "comments", "samples"
end
