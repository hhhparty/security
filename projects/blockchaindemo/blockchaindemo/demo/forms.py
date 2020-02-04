from django import forms
import time


class TransactionForm(forms.Form):
    sender = forms.CharField(label='sender')
    recipient = forms.CharField(label='recipient')
    amount = forms.IntegerField(label='amount')
    
class BlockForm(forms.Form):
    index = forms.IntegerField(label='index')
    timestamp = forms.CharField(label='timestamp')
    transactions = forms.CharField(label='transactions')
    proof = forms.CharField(label='proof')
    previous_hash = forms.CharField(label='previous_hash')