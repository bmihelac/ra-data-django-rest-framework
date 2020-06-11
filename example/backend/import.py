# import example data from json
# run in example project django shell
import datetime
import json
from pathlib import Path

from exampleapp.models import Author, Comment, Post, Tag

data = json.load(open(Path() / "data" / "data.json"))


def to_date(value):
    return datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%fZ").date()


for model_class in (Author, Post, Tag, Comment):
    model_class.objects.all().delete()


for tag in data["tags"]:
    Tag.objects.create(**tag)

for post in data["posts"]:
    post.pop("pictures", None)
    post.pop("subcategory", None)
    tags = post.pop("tags", [])
    post["published_at"] = to_date(post["published_at"])
    p = Post.objects.create(**post)
    p.tags.set(tags)

for user in data["users"]:
    del user["role"]
    Author.objects.create(**user)


for comment in data["comments"]:
    comment["created_at"] = to_date(comment["created_at"])
    author = comment.pop("author")
    name = author.pop("name", None)
    if not name:
        continue
    comment["author"] = Author.objects.get_or_create(
        name=name,
        defaults=author
    )[0]
    Comment.objects.create(**comment)
