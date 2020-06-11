from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from exampleapp.api import TagViewSet, PostViewSet, CommentViewSet, UserViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("tags", TagViewSet)
router.register("posts", PostViewSet)
router.register("comments", CommentViewSet)
router.register("users", UserViewSet)


app_name = "api"
urlpatterns = router.urls
