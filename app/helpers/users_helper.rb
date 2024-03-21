module UsersHelper
  def user_class(user)
    if user.admin?
      'admin'
    else
      'general'
    end
  end
end
