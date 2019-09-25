# Tutorial

1.更改完设置、生成数据库表可以使用
python manage.py migrate

>The migrate command looks at the INSTALLED_APPS setting and creates any necessary database tables according to the database settings in your mysite/settings.py file and the database migrations shipped with the app (we’ll cover those later). 


2.编写完model，需要运行
python manage.py makemigrations polls

Remember the three-step guide to making model changes:
- Change your models (in models.py).
- Run python manage.py makemigrations to create migrations for those changes
- Run python manage.py migrate to apply those changes to the database.

3.生成数据库
python manage.py sqlmigrate polls 0001

4.检查项目在运行migrations或访问数据库时的问题可用
python manage.py check

5.Interactive Python shell and play around with the free API Django gives you. 
```
python manage.py shell

>>> from portal.models import Task,Action
>>> Task.objects.all()
<QuerySet []>
>>> from django.utils import timezone
>>> t = Task(task_desc='Go to school at 8:00',task_deadline=timezone.now())

>>> t.save()
>>> t.id
1
>>> t.task_desc
'Go to school at 8:00'

>>> t.task_deadline
datetime.datetime(2019, 9, 24, 13, 38, 59, 779983, tzinfo=<UTC>)

```

superuser：hhhparty，password：H1234567

