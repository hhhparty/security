# Django

## How django process a request

1. A user requests a page from your django-powered site.
2. Django determines the root URLconf module to use. Ordinarily, this is the value of the ROOT_URLCONF setting, but if the incomming HttpRequest object has a urlconf attribute(middleware), its value will be used in place of the ROOT_URLCONF
3. Django loads that Python module and looks for the variable urlpatterns. This should be a sequence of django.urls.path() and/or django.urls.re_path() instances.
4. Django runs through each URL pattern, in order, and stops at the first one that matches the requested URL, matching against path_info.
5. Once one of the URL patterns matches, Django imports and calls the given view, which is a Python function( or a class based view). This view gets passed the following arguments:
   - An instance of HttpRequest
   - If the matched URL pattern contained no named groups, then the matches from the regular expression are provided as positional arguments.
   - The keyword arguments are made up of any named parts matched by the path expression that are provided, overridden by any arguments specified in the optional kwargs argument to django.urls.path() or django.urls.re_path().
5. if no URL patthern matches, or if an exception is raised during any point in this process, Django invokes an appropriate error-handling view.

## Request and response objects

Django uses reuqest and response objects to pass state through the system.

When a page is requested, Django creates an HttpRequest object that contains metadata about the request. Then Django loads the appropriate view, passing the HttpRequest as the first argument to the view function. Each view is responsible for returning an HttpResponse object.