# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_11_28_114530) do
  # These are extensions that must be enabled in order to support this database
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
    t.string "department"
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
    t.string "department"
    t.index ["name"], name: "index_users_on_name"
  end

  add_foreign_key "comments", "samples"
end
