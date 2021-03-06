# Generated by Django 3.0.6 on 2020-05-29 15:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exampleapp', '0004_auto_20200529_1417'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='backlinks',
            field=models.TextField(blank=True, verbose_name='backlinks'),
        ),
        migrations.AlterField(
            model_name='post',
            name='tags',
            field=models.ManyToManyField(blank=True, related_name='tags', to='exampleapp.Tag', verbose_name='tags'),
        ),
    ]
