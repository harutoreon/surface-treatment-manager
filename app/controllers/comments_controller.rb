class CommentsController < ApplicationController
  before_action :logged_in_user, only: :destroy
  before_action :admin_user, only: :destroy

  def create
    @sample = Sample.find(params[:sample_id])
    @comment = @sample.comments.build(comment_params)

    if @comment.save
      flash[:success] = 'コメントを1件追加しました。'
      redirect_to sample_path(@sample)
    else
      flash.now[:danger] = 'コメントの投稿者またはコメントが無効です。'
      render 'samples/show', status: :unprocessable_entity
    end
  end

  def destroy
    @sample = Sample.find(params[:sample_id])
    @comment = @sample.comments.find(params[:id])
    @comment.destroy
    redirect_to sample_path(@sample), status: :see_other
  end

  private

    def comment_params
      params.require(:comment).permit(:commenter, :body)
    end
end
