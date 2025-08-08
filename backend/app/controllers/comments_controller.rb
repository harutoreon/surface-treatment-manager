class CommentsController < ApplicationController
  def index
    sample = Sample.find(params[:sample_id])
    comments = sample.comments

    render json: comments, status: :ok
  end

  def show
    sample = Sample.find(params[:sample_id])
    comment = sample.comments.find(params[:id])

    render json: comment, status: :ok
  end

  def create
    sample = Sample.find(params[:sample_id])
    comment = sample.comments.build(comment_params)

    if comment.save
      render json: comment, status: :created, location: sample_comment_url(sample, comment)
    else
      render json: comment.errors, status: :unprocessable_entity
    end
  end

  def update
    sample = Sample.find(params[:sample_id])
    comment = sample.comments.find(params[:id])

    if comment.update(comment_params)
      render json: comment, status: :ok
    else
      render json: comment.errors, status: :unprocessable_entity
    end
  end

  def destroy
    sample = Sample.find(params[:sample_id])
    comment = sample.comments.find(params[:id])
    comment.destroy
    head :no_content
  end

  def comment_list
    comments = Comment.paginate(page: params[:page], per_page: 10)

    render json: {
      comments: comments,
      current_page: comments.current_page,
      total_pages: comments.total_pages
    },
    status: :ok
  end

  private

    def comment_params
      params.require(:comment).permit(:commenter, :department, :body)
    end
end
