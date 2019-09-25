# Django 中的 Authentication

Django中自带了一个user authentication 系统。它包含了：
- user accounts
- groups
- permissions
- cookie-based user sessions

这部分功能可以扩展和自定义。

## Overview

Django认证系统（authentication system）包含 authentication 和 authorization。
- authentication verifies a user who they claim to be.
- authorization determines what an authenticated user is allowed to do.

Django auth system包含组件：
- Users
- Permissions：Binary（yes/no）flags designationg whether a user may perform a certain task.
- Groups：A generic way of applying labels and permissions to more than one user.
- A configurable password hashing system.
- Forms and view tools for logging in users, or retricting content.
- A pluggable backend system.

Django认证系统的目的是非常通用的，没有提供web系统中常见的某些功能。有些通用问题在某些第三方包里实现：
- Password strength checking
- Throttling of login attempts
- Authentication against 3-parties(OAuth , for example)
- Object-level permissions

Django认证系统作为一个django contrib 模块存于 django.contrib.auth。默认情况下，setting.py中的INSTALLED_APPS中存在两个相关部分：
- django.contrib.auth, 包含了认证框架的核心和默认模型
- django.contrib.contentypes，是django content type system，它使 permissions 与你生成的模型相关联。

在自定义中间件中的设置：
- SessionMiddleware，管理这请求过程中的sessions
- AuthenticationMiddleware，关联着使用sessions的用户与请求。

使用```manage.py migrate ```生成必要的数据库表来存储auth相关models和定义在自定义apps中models里的permissions。

## Django authentication system 基本用例

### User 对象

User 对象表达了与网站交互的人。

Django authentication system 中仅有一种类型的user是有特殊属性集的，例如 superusers 或 admin staff；其它类型的用户没有特殊属性集。

默认用户的属性有：
- username
- password
- email
- first_name
- last_name
  
#### 生成用户

使用：
```
>>> from django.contrib.auth.models import User
>>> user = User.objects.create_user('john', 'lennon@thebeatles.com', 'johnpassword')
```
#### 生成超级用户

使用：
```
$ python manage.py createsuperuser --username=joe --email=joe@example.com
```
#### 设置密码

Django不存储原始明文密码在user model中，仅存明文的hash结果。所以不能直接存取密码属性，需要使用下列方法set_password：
```
>>> from django.contrib.auth.models import User
>>> u = User.objects.get(username='john')
>>> u.set_password('new password')
>>> u.save()
```

Django also provides views and forms that may be used to allow users to change their own passwords.

Changing a user’s password will log out all their sessions. See Session invalidation on password change for details.

#### 认证users

Use authenticate() to verify a set of credentials. 

authenticate() 方法将凭证（credentials）作为参数，credentials默认构成是username 和password。

authenticate() 方法会将用户提交的凭证与authentication backend的记录做比较，当验证通过时，返回某个用户对象。

如果凭证在后台未通过验证，或报出异常PermissionDenied，则返回None。

```
from django.contrib.auth import authenticate
user = authenticate(username='john', password='secret')
if user is not None:
    # A backend authenticated the credentials
else:
    # No backend authenticated the credentials
```

request is an optional HttpRequest which is passed on the authenticate() method of the authentication backends.
> This is a low level way to authenticate a set of credentials; for example, it’s used by the RemoteUserMiddleware. Unless you are writing your own authentication system, you probably won’t use this. Rather if you’re looking for a way to login a user, use the LoginView.

### Permissions and Authorization

Django里内置了一个简单的权限系统，to assign permissions to specific users and groups of users.

It’s used by the Django admin site, but you’re welcome to use it in your own code.

Django admin site中的权限管理包括：
- Access of view objects的权限，使用“view” 或“change” permission进行约束。
- Access of view the 'add' form，以及增加某个对象的权限，使用“add” permission约束。
- Access to view the change list, view the “change” form and change an object is limited to users with the “change” permission for that type of object.
- Access to delete an object is limited to users with the “delete” permission for that type of object.

Permissions 不仅可以对每个类型的对象进行设置，也可以对每隔特定对象实例。

使用下列methods provided by the ModelAdmin class, it is possible to customize permissions for different object instances of the same type
- has_view_permission()
- has_add_permission()
- has_change_permission() 
- has_delete_permission() 

User objects have two many-to-many fields（多对多）:
- groups 
- user_permissions. 

User objects can access their related objects in the same way as any other Django model:
```
myuser.groups.set([group_list])
myuser.groups.add(group, group, ...)
myuser.groups.remove(group, group, ...)
myuser.groups.clear()
myuser.user_permissions.set([permission_list])
myuser.user_permissions.add(permission, permission, ...)
myuser.user_permissions.remove(permission, permission, ...)
myuser.user_permissions.clear()
```

#### Default Permission

When django.contrib.auth is listed in your INSTALLED_APPS setting, it will ensure that four default permissions – add, change, delete, and view – are created for each Django model defined in one of your installed applications.

These permissions will be created when you run manage.py migrate; the first time you run migrate after adding django.contrib.auth to INSTALLED_APPS, the default permissions will be created for all previously-installed models, as well as for any new models being installed at that time. Afterward, it will create default permissions for new models each time you run manage.py migrate (the function that creates permissions is connected to the post_migrate signal).

Assuming you have an application with an app_label foo and a model named Bar, to test for basic permissions you should use:
- add: user.has_perm('foo.add_bar')
- change: user.has_perm('foo.change_bar')
- delete: user.has_perm('foo.delete_bar')
- view: user.has_perm('foo.view_bar')
The Permission model is rarely accessed directly.

### Permission model

class models.Permission

Permission objects have the following fields:
- name
Required. 255 characters or fewer. Example: 'Can vote'.

- content_type
  
Required. A reference to the django_content_type database table, which contains a record for each installed model.

- codename

Required. 100 characters or fewer. Example: 'can_vote'.


### Groups

django.contrib.auth.models.Group models are a generic way of categorizing users so you can apply permissions, or some other label, to those users. A user can belong to any number of groups.

A user in a group automatically has the permissions granted to that group. For example, if the group Site editors has the permission can_edit_home_page, any user in that group will have that permission.

Beyond permissions, groups are a convenient way to categorize users to give them some label, or extended functionality. For example, you could create a group 'Special users', and you could write code that could, say, give them access to a members-only portion of your site, or send them members-only email messages.

### Programmatically creating permissions

自定义permissions可以定义在模型的Meta类中，你可以直接生成permissions。例如生成一个can_publish 权限给一个blogpost模型在myapp中：
```
from myapp.models import BlogPost
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

content_type = ContentType.objects.get_for_model(BlogPost)
permission = Permission.objects.create(
    codename='can_publish',
    name='Can Publish Posts',
    content_type=content_type,
)
```

The permission can then be assigned to a User via its user_permissions attribute or to a Group via its permissions attribute.

Proxy models need their own content type. If you want to create permissions for a proxy model, pass for_concrete_model=False to ContentTypeManager.get_for_model() to get the appropriate ContentType:
```
content_type = ContentType.objects.get_for_model(BlogPostProxy, for_concrete_model=False)
```

#### Permission caching

用户对象的模型后台caches权限会在它第一次获取权限检查时获取。这是一个典型的request-response循环，因为权限不是需要在增加后就要被检查。

如果要在生成权限时立即检查权限，那么最简单的方法是从数据库中重新获取user。

The ModelBackend caches permissions on the user object after the first time they need to be fetched for a permissions check. This is typically fine for the request-response cycle since permissions aren’t typically checked immediately after they are added (in the admin, for example). If you are adding permissions and checking them immediately afterward, in a test or view for example, the easiest solution is to re-fetch the user from the database. For example:

```
from django.contrib.auth.models import Permission, User
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404

from myapp.models import BlogPost

def user_gains_perms(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    # any permission check will cache the current set of permissions
    user.has_perm('myapp.change_blogpost')

    content_type = ContentType.objects.get_for_model(BlogPost)
    permission = Permission.objects.get(
        codename='change_blogpost',
        content_type=content_type,
    )
    user.user_permissions.add(permission)

    # Checking the cached permission set
    user.has_perm('myapp.change_blogpost')  # False

    # Request new instance of User
    # Be aware that user.refresh_from_db() won't clear the cache.
    user = get_object_or_404(User, pk=user_id)

    # Permission cache is repopulated from the database
    user.has_perm('myapp.change_blogpost')  # True

    ...
```

### Proxy models

Proxy models 与实际models的工作一样。

使用proxy model的自己的内容类型，生成Permissions。

代理模型不继承权限具体model的权限。

```
class Person(models.Model):
    class Meta:
        permissions = [('can_eat_pizzas', 'Can eat pizzas')]

class Student(Person):
    class Meta:
        proxy = True
        permissions = [('can_deliver_pizzas', 'Can deliver pizzas')]

>>> # Fetch the content type for the proxy model.
>>> content_type = ContentType.objects.get_for_model(Student, for_concrete_model=False)
>>> student_permissions = Permission.objects.filter(content_type=content_type)
>>> [p.codename for p in student_permissions]
['add_student', 'change_student', 'delete_student', 'view_student',
'can_deliver_pizzas']
>>> for permission in student_permissions:
...     user.user_permissions.add(permission)
>>> user.has_perm('app.add_person')
False
>>> user.has_perm('app.can_eat_pizzas')
False
>>> user.has_perms(('app.add_student', 'app.can_deliver_pizzas'))
True
```

### Authentication in Web requests

Django uses sessions and middleware to hook the authentication system into request objects.

These provide a request.user attribute on every request which represents the current user. If the current user has not logged in, this attribute will be set to an instance of AnonymousUser, otherwise it will be an instance of User.

You can tell them apart with is_authenticated, like so:
```
if request.user.is_authenticated:
    # Do something for authenticated users.
    ...
else:
    # Do something for anonymous users.
    ...
```

### How to log a user in

如果有一个认证后用户，想附加在当前会话上，可以使用login函数。

If you have an authenticated user you want to attach to the current session - this is done with a login() function.


- login(request, user, backend=None)[source]

To log a user in, from a view, use login(). It takes an HttpRequest object and a User object. login() saves the user’s ID in the session, using Django’s session framework.

Note that any data set during the anonymous session is retained in the session after a user logs in.

This example shows how you might use both authenticate() and login():

```
from django.contrib.auth import authenticate, login

def my_view(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        # Redirect to a success page.
        ...
    else:
        # Return an 'invalid login' error message.
        ...
```
### Selecting the authentication backend

When a user logs in, the user’s ID and the backend that was used for authentication are saved in the user’s session. This allows the same authentication backend to fetch the user’s details on a future request. The authentication backend to save in the session is selected as follows:
- Use the value of the optional backend argument, if provided.
- Use the value of the user.backend attribute, if present. This allows pairing authenticate() and login(): authenticate() sets the user.backend attribute on the user object it returns.
- Use the backend in AUTHENTICATION_BACKENDS, if there is only one.
- Otherwise, raise an exception.

In cases 1 and 2, the value of the backend argument or the user.backend attribute should be a dotted import path string (like that found in AUTHENTICATION_BACKENDS), not the actual backend class.

自定义认证后端可以参考：https://docs.djangoproject.com/en/2.2/topics/auth/customizing/#authentication-backends


### How to log a user out

To log out a user who has been logged in via django.contrib.auth.login(), use django.contrib.auth.logout() within your view. It takes an HttpRequest object and has no return value. Example:
```
from django.contrib.auth import logout

def logout_view(request):
    logout(request)
    # Redirect to a success page.
```

Note that logout() doesn’t throw any errors if the user wasn’t logged in.

When you call logout(), the session data for the current request is completely cleaned out. All existing data is removed. This is to prevent another person from using the same Web browser to log in and have access to the previous user’s session data. If you want to put anything into the session that will be available to the user immediately after logging out, do that after calling django.contrib.auth.logout().

### Limiting access to logged-in users

#### The raw way

The simple, raw way to limit access to pages is to check request.user.is_authenticated and either redirect to a login page:

```
from django.conf import settings
from django.shortcuts import redirect

def my_view(request):
    if not request.user.is_authenticated:
        return redirect('%s?next=%s' % (settings.LOGIN_URL, request.path))
    # ...
…or display an error message:

from django.shortcuts import render

def my_view(request):
    if not request.user.is_authenticated:
        return render(request, 'myapp/login_error.html')
    # ...
```

#### The login_required decorator

login_required(redirect_field_name='next', login_url=None)[source]

As a shortcut, you can use the convenient login_required() decorator:
```
from django.contrib.auth.decorators import login_required

@login_required
def my_view(request):
    ...
```

login_required() does the following:
- 如果user 未login，重定向到 redirect to settings.LOGIN_URL, passing the current absolute path in the query string. Example: /accounts/login/?next=/polls/3/.
- 如果user logged in，execute the view normally. The view code is free to assume the user is logged in.
By default, the path that the user should be redirected to upon successful authentication is stored in a query string parameter called "next". If you would prefer to use a different name for this parameter, login_required() takes an optional redirect_field_name parameter:

```
from django.contrib.auth.decorators import login_required

@login_required(redirect_field_name='my_redirect_field')
def my_view(request):
    ...
```

Note that if you provide a value to redirect_field_name, you will most likely need to customize your login template as well, since the template context variable which stores the redirect path will use the value of redirect_field_name as its key rather than "next" (the default).

login_required() also takes an optional login_url parameter. Example:

```
from django.contrib.auth.decorators import login_required

@login_required(login_url='/accounts/login/')
def my_view(request):
    ...
```

Note that if you don’t specify the login_url parameter, you’ll need to ensure that the settings.LOGIN_URL and your login view are properly associated. For example, using the defaults, add the following lines to your URLconf:

```
from django.contrib.auth import views as auth_views

path('accounts/login/', auth_views.LoginView.as_view()),
```


The settings.LOGIN_URL also accepts view function names and named URL patterns. This allows you to freely remap your login view within your URLconf without having to update the setting.

Note

The login_required decorator does NOT check the is_active flag on a user, but the default AUTHENTICATION_BACKENDS reject inactive users.

See also

If you are writing custom views for Django’s admin (or need the same authorization check that the built-in views use), you may find the django.contrib.admin.views.decorators.staff_member_required() decorator a useful alternative to login_required().

#### The login_required mixin

When using class-based views, you can achieve the same behavior as with login_required by using the LoginRequiredMixin. This mixin should be at the leftmost position in the inheritance list.


If a view is using this mixin, all requests by non-authenticated users will be redirected to the login page or shown an HTTP 403 Forbidden error, depending on the raise_exception parameter.

You can set any of the parameters of AccessMixin to customize the handling of unauthorized users:

```
from django.contrib.auth.mixins import LoginRequiredMixin

class MyView(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'redirect_to'
```

Just as the login_required decorator, this mixin does NOT check the is_active flag on a user, but the default AUTHENTICATION_BACKENDS reject inactive users.

> Todo: https://docs.djangoproject.com/en/2.2/topics/auth/default/#topic-authorization