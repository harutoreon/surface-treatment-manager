class CommentsController < ApplicationController
  def index
    maker = Maker.find(params[:maker_id])
    sample = maker.samples.find(params[:sample_id])
    comments = sample.comments

    render json: comments, status: :ok
  end

  def show
    maker = Maker.find(params[:maker_id])
    sample = maker.samples.find(params[:sample_id])
    comment = sample.comments.find(params[:id])

    render json: comment, status: :ok
  end

  def create
    maker = Maker.find(params[:maker_id])
    sample = maker.samples.find(params[:sample_id])
    comment = sample.comments.build(comment_params)

    if comment.save
      render json: comment, status: :created, location: maker_sample_comment_url(maker, sample, comment)
    else
      render json: comment.errors, status: :unprocessable_content
    end
  end

  def update
    maker = Maker.find(params[:maker_id])
    sample = maker.samples.find(params[:sample_id])
    comment = sample.comments.find(params[:id])

    if comment.update(comment_params)
      render json: comment, status: :ok
    else
      render json: comment.errors, status: :unprocessable_content
    end
  end

  def destroy
    maker = Maker.find(params[:maker_id])
    sample = maker.samples.find(params[:sample_id])
    comment = sample.comments.find(params[:id])
    comment.destroy
    head :no_content
  end

  def comment_list
    comments = Comment.order(:id).paginate(page: params[:page], per_page: 7)

    render json: {
      comments: comments,
      current_page: comments.current_page,
      total_pages: comments.total_pages
    },
    status: :ok
  end

  def comment_information
    comment = Comment.find(params[:id])
    sample = Sample.find(comment.sample_id)

    render json: {
      comment: comment,
      maker_id: sample.maker_id,
    },
    status: :ok
  end

  private

    def comment_params
      params.require(:comment).permit(:commenter, :department, :body, :user_id)
    end
end
