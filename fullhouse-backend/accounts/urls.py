from django.urls import path

from . import views

urlpatterns = [
        path("", views.index, name="index"),
        path("profile/", views.user_information, name="profile"),
        path("login/", views.login_user, name="login"),
            ]



