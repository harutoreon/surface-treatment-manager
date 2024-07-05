class StaticPagesController < ApplicationController
  before_action :logged_in_user, only: [:home]

  def home
  end

  def name
  end

  def category
  end

  def maker
  end
end
