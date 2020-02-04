from django.urls import path

from . import views

app_name = 'demo'

urlpatterns = [
    path('',views.IndexView.as_view(),name='index'),
    path('transactions/',views.TransView.as_view(),name='transactions'),
    path('newtransaction',views.NewTransView.as_view(),name='newtransaction'),
    path('mine/',views.MineView.as_view(),name='mine'),
    path('chain/',views.ChainView.as_view(),name='chain'),
    path('noderegister/',views.NodeRegister.as_view(),name='noderegister'),
    path('consensus/',views.ConsensusView.as_view(),name='consensus'),
    
]