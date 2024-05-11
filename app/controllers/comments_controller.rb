class CommentsController < ApplicationController
  def create
    @sample = Sample.find(params[:sample_id])
    @comment = @sample.comments.build(comment_params)

    if @comment.save
      flash[:success] = '1 comment added.'
      redirect_to sample_path(@sample)
    else
      flash.now[:danger] = 'Invalid commenter or comment.'
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
