from django.db import models
from jsonfield import JSONField


class Author(models.Model):
    name = models.CharField("name", max_length=100)
    email = models.EmailField("email", max_length=100, blank=True, default="")

    class Meta:
        verbose_name = "Author"
        verbose_name_plural = "Authors"


class Tag(models.Model):
    name = models.CharField("name", max_length=100)
    parent = models.ForeignKey(
        "self", verbose_name="parent", blank=True, null=True, on_delete=models.CASCADE
    )
    published = models.BooleanField("published", default=True)

    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tags"


class Post(models.Model):
    title = models.CharField("title", max_length=100)
    teaser = models.TextField("teaser")
    body = models.TextField("body")
    views = models.IntegerField("views", default=0)
    average_note = models.FloatField("average_note", null=True)
    commentable = models.BooleanField("commentable", default=True)
    published_at = models.DateField("published_at", blank=True)
    category = models.CharField("category", max_length=100, blank=True)
    subcategory = models.CharField("subcategory", max_length=100, blank=True)
    tags = models.ManyToManyField(Tag, verbose_name="tags", related_name="tags", blank=True)
    backlinks = JSONField(
        'backlinks',
        blank=True,
        default=list,
    )
    notifications = JSONField(
        'notifications',
        blank=True,
        default=list,
    )
    authors = JSONField(
        'authors',
        blank=True,
        default=list,
    )

    class Meta:
        verbose_name = "Post"
        verbose_name_plural = "Posts"


class Comment(models.Model):
    post = models.ForeignKey(Post, verbose_name="post", on_delete=models.CASCADE)
    body = models.TextField("body")
    created_at = models.DateField("created_at", auto_now_add=True, blank=True)
    author = models.ForeignKey(Author, verbose_name="author", on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Comment"
        verbose_name_plural = "Comments"
