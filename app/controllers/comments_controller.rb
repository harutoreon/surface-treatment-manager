class CommentsController < ApplicationController
  def create
    @sample = Sample.find(params[:sample_id])
    @comment = @sample.comments.create(comment_params)
    redirect_to sample_path(@sample)
  end

  private

    def comment_params
      params.require(:comment).permit(:commenter, :body)
    end
end
