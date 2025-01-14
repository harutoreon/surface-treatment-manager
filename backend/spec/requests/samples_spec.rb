# require 'rails_helper'

# RSpec.describe "Samples", type: :request do
#   describe '#index' do
#     it 'レスポンスが正常であること' do
#       get samples_path
#       expect(response).to have_http_status(:success)
#     end

#     it 'タイトルが表示されること' do
#       get samples_path
#       expect(response.body).to include('<title>表面処理リスト</title>')
#     end
#   end

#   describe "#show" do
#     before do
#       @sample = FactoryBot.create(:sample)
#       admin_user = FactoryBot.create(:admin_user)
#       log_in(admin_user)
#     end

#     it 'レスポンスが正常であること' do
#       get sample_path(@sample)
#       expect(response).to have_http_status(:success)
#     end

#     it 'タイトルが表示されること' do
#       get sample_path(@sample)
#       expect(response.body).to include('<title>表面処理情報</title>')
#     end
#   end

#   describe '#new' do
#     it 'レスポンスが正常であること' do
#       get new_sample_path
#       expect(response).to have_http_status(:success)
#     end

#     it 'タイトルが表示されること' do
#       get new_sample_path
#       expect(response.body).to include('<title>表面処理情報の登録</title>')
#     end
#   end

#   describe '#create' do
#     context '有効なパラメータの場合' do
#       before do
#         @valid_sample_params = { sample: { name: "銅めっき",
#                                            category: "表面硬化",
#                                            color: "マゼンタ",
#                                            maker: "有限会社松本農林",
#                                            picture: Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')),
#                                            hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
#                                            film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
#                                            feature: '耐食性・耐摩耗性・耐薬品性・耐熱性' } }
#       end

#       it '登録が成功すること' do
#         expect { post samples_path, params: @valid_sample_params }.to change{ Sample.count }.from(0).to(1)
#       end

#       it 'samples/showにリダイレクトされること' do
#         post samples_path, params: @valid_sample_params
#         sample = Sample.last
#         expect(response).to redirect_to(sample)
#       end
#     end

#     context '無効なパラメータの場合' do
#       before do
#         @invalid_sample_params = { sample: { name: "",
#                                              category: "表面硬化",
#                                              color: "マゼンタ",
#                                              maker: "有限会社松本農林",
#                                              picture: Rack::Test::UploadedFile.new(File.join(Rails.root, 'spec/fixtures/test.jpg')),
#                                              hardness: '析出状態の皮膜硬度でHV550～HV700、熱処理後の皮膜硬度はHV950程度',
#                                              film_thickness: '通常は3～5μm、厚めの場合は20～50μmまで可能',
#                                              feature: '耐食性・耐摩耗性・耐薬品性・耐熱性' } }
#       end

#       it '登録が失敗すること' do
#         expect { post samples_path, params: @invalid_sample_params }.to_not change{ Sample.count }.from(0)
#       end

#       it 'samples/newが再描画されること' do
#         post samples_path, params: @invalid_sample_params
#         expect(response.body).to include("表面処理情報の登録")
#       end
#     end
#   end

#   describe '#edit' do
#     before do
#       @sample = FactoryBot.create(:sample)
#     end

#     context 'ログイン済みの場合' do
#       before do
#         user = FactoryBot.create(:user)
#         log_in(user)
#       end

#       it 'レスポンスが正常であること' do
#         get edit_sample_path(@sample)
#         expect(response).to have_http_status(:success)
#       end

#       it 'タイトルが表示されること' do
#         get edit_sample_path(@sample)
#         expect(response.body).to include('<title>表面処理情報の編集</title>')
#       end
#     end

#     context '未ログインの場合' do
#       it "ログインページにリダイレクトされること" do
#         get edit_sample_path(@sample)
#         expect(response).to redirect_to login_url
#       end

#       it 'フラッシュメッセージが表示されること' do
#         get edit_sample_path(@sample)
#         expect(flash[:danger]).to eq('ログインしてください')
#       end
#     end
#   end

#   describe '#update' do
#     before do
#       @sample = FactoryBot.create(:sample)
#     end

#     context 'ログイン済みで' do
#       before do
#         user = FactoryBot.create(:user)
#         log_in(user)
#       end

#       context '有効なパラメータの場合' do
#         it '更新が成功すること' do
#           patch sample_path(@sample), params: { sample: { name: "ハードクロムめっき" } }
#           @sample.reload
#           expect(@sample.name).to eq("ハードクロムめっき")
#         end

#         it 'samples/showページにリダイレクトされること' do
#           patch sample_path(@sample), params: { sample: { name: "ハードクロムめっき" } }
#           @sample.reload
#           expect(response).to redirect_to(@sample)
#         end
#       end

#       context '無効なパラメータの場合' do
#         it '更新が失敗すること' do
#           patch sample_path(@sample), params: { sample: { name: "" } }
#           @sample.reload
#           expect(@sample.name).to eq("無電解ニッケルめっき")
#         end

#         it 'samples/editページが表示されること' do
#           patch sample_path(@sample), params: { sample: { name: "" } }
#           expect(response.body).to include("表面処理情報の編集")
#         end
#       end
#     end

#     context '未ログインの場合' do
#       it "ログインページにリダイレクトされること" do
#         patch sample_path(@sample), params: { sample: { name: "ハードクロムめっき" } }
#         expect(response).to redirect_to login_url
#       end

#       it 'フラッシュメッセージが表示されること' do
#         patch sample_path(@sample), params: { sample: { name: "ハードクロムめっき" } }
#         expect(flash[:danger]).to eq('ログインしてください')
#       end
#     end
#   end

#   describe '#destroy' do
#     before do
#       @sample = FactoryBot.create(:sample)
#       @sample.comments.create(commenter: 'sample user', department: 'department', body: 'sample comment.')
#     end

#     context '管理者ユーザーでログインした場合' do
#       before do
#         admin_user = FactoryBot.create(:admin_user)
#         log_in(admin_user)
#       end

#       it '削除に成功すること' do
#         expect { delete sample_path(@sample) }.to change{ Sample.count }.from(1).to(0)
#       end

#       it '紐付いたコメントも削除されること' do
#         expect { delete sample_path(@sample) }.to change{ Comment.count }.from(1).to(0)
#       end

#       it 'samples/indexページにリダイレクトされること' do
#         delete sample_path(@sample)
#         expect(response).to redirect_to(samples_url)
#       end

#       it 'フラッシュメッセージが表示されること' do
#         delete sample_path(@sample)
#         expect(flash[:success]).to eq('表面処理の削除に成功しました!')
#       end
#     end

#     context '一般ユーザーでログインした場合' do
#       before do
#         general_user = FactoryBot.create(:general_user)
#         log_in(general_user)
#       end

#       it "ログインページにリダイレクトされること" do
#         delete maker_path(@sample)
#         expect(response).to redirect_to(login_url)
#       end
#     end

#     context '未ログインの場合' do
#       it "ログインページにリダイレクトされること" do
#         delete sample_path(@sample)
#         expect(response).to redirect_to login_url
#       end

#       it "フラッシュメッセージが表示されること" do
#         delete sample_path(@sample)
#         expect(flash[:danger]).to eq('ログインしてください')
#       end
#     end
#   end
# end
