import json

from django.contrib.auth.models import Group
from rest_framework import authentication, permissions, serializers, viewsets

from exampleapp.models import Author, Comment, Post, Tag

from . import filters


def update_instance(instance, validated_data):
    for attr, value in validated_data.items():
        setattr(instance, attr, value)
    instance.save()


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name", "parent", "published")


class AuthorSerializer(serializers.ModelSerializer):
    model = Author

    class Meta:
        model = Author
        fields = ("id", "name", "email")


class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(many=False)

    class Meta:
        model = Comment
        fields = ("id", "post", "body", "created_at", "author")

    def create(self, validated_data):
        author_data = validated_data.pop("author")
        author = Author.objects.create(**author_data)
        comment = Comment.objects.create(author=author, **validated_data)
        return comment

    def update(self, instance, validated_data):
        update_instance(instance.author, validated_data.pop("author"))
        update_instance(instance, validated_data)
        return instance


class TagRelatedField(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        return super().get_queryset()


class PostSerializer(serializers.ModelSerializer):
    tags = TagRelatedField(many=True, queryset=Tag.objects.all(), required=False)
    backlinks = serializers.JSONField(required=False)
    notifications = serializers.JSONField(required=False)
    authors = serializers.JSONField(required=False)

    class Meta:
        model = Post
        fields = (
            "id",
            "title",
            "teaser",
            "body",
            "views",
            "average_note",
            "commentable",
            "published_at",
            "category",
            "subcategory",
            "tags",
            "backlinks",
            "notifications",
            "authors",
        )


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filterset_class = filters.PostFilter
    search_fields = ["title", "teaser", "body"]


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    filterset_fields = ["post"]
    search_fields = ["body"]


class UserViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    filterset_class = filters.UserFilterSet
    search_fields = ["name"]
