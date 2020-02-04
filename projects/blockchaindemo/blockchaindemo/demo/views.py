from django.shortcuts import render
from django.views import generic
from .blockchain import Blockchain
from uuid import uuid4
from .forms import TransactionForm,BlockForm
from django.http import Http404,HttpResponse,JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
from . import nodeslist
# Create your views here.

# Generate a globally unique address for this node
node_identifier = str(uuid4()).replace('-', '')

# Instantiate the Blockchain
blockchain = Blockchain()

class IndexView(generic.base.TemplateView):
    template_name = 'demo/index.html'
    
    def get(self,request,*args,**kwargs):
        for address in nodeslist.nodes.values():
            blockchain.regist_node(address)
        response = {'nodes':list(blockchain.nodes)}
        return render(request,'demo/index.html',response)
    
    
class NewTransView(generic.edit.FormView):
    template_name = 'demo/transactions.html'
    form_class = TransactionForm
    context_object_name = 'newtransaction_obj'
    #success_url = '/thanks/'
    
    def get_context_data(self,**kwargs):
        kwargs['newtrans'] = True
        return super(NewTransView,self).get_context_data(**kwargs)
   
    def post(self,request, *args, **kwargs):
        #new transaction
        values = request.POST
        
        #Create a new Transaction
        index = blockchain.new_transaction(values['sender'],values['recipient'],values['amount'])
        
        return HttpResponse("Transaction will be added to Block {}.".format(index))
          
class TransView(generic.ListView):
    template_name = 'demo/transactions.html'
    context_object_name = 'transactions_obj'
    
    def get_queryset(self):
        pass
        
    def get_context_data(self,**kwargs):
        kwargs['text'] = "We'll add a new transaction"
        return super(TransView,self).get_context_data(**kwargs)
   
class ChainView(generic.ListView):
    template_name = 'demo/chain.html'
    context_object_name = 'chain_obj'
    
    def get_queryset(self):
        pass
        
    def get_context_data(self,**kwargs):
        chain = {
            'chain': blockchain.chain,
            'length': len(blockchain.chain),
        }
        kwargs['chain'] = chain
        return super(ChainView,self).get_context_data(**kwargs)
    
class MineView(generic.ListView):
    template_name = 'demo/mine.html'
    context_object_name = 'mine_obj'
   
    def get_queryset(self):
        pass
        
    def get_context_data(self,**kwargs):
        kwargs['text'] = "We'll mine a new Block"
        return super(MineView,self).get_context_data(**kwargs)
        
    def get(self,request, *args, **kwargs):
        #We run the proof of work algorithm to get the next proof
       
        last_block = blockchain.last_block
        last_proof = last_block['proof']
        proof = blockchain.proof_of_work(last_proof)
        
        #We must receive a reward for finding the proof.
        #The sender is '0' to signify that this node has mined a new coin.
        blockchain.new_transaction(
            sender = "0",
            recipient = node_identifier,
            amount = 1,
        )
         # Forge the new Block by adding it to the chain
        block = blockchain.new_block(proof=proof)     
                      
        response = {
            'message': "New Block Forged",
            'index': block['index'],
            'timestamp': block['timestamp'],
            'transactions': block['transactions'],
            'proof': block['proof'],
            'previous_hash': block['previous_hash'],
            'block':block,
        }
        return render(request,'demo/mine.html',response)
        
class NodeRegister(generic.edit.FormView):
    template_name = 'demo/noderegister.html'
    context_object_name = 'noderegister_obj'
    form_class = BlockForm
    
    def get(self,request,*args,**kwargs):
        node = request.get_host()
        
        if node is None:
            return render(request,
            'demo/noderegister.html',
            {'message':'Error: Please supply a valid list of nodes','total_nodes':[]})       
        blockchain.regist_node(node)
        print(blockchain.nodes)
        response = {
            'status': 'True',
            'message': 'New nodes have been added',
            'total_nodes': list(blockchain.nodes),
        }
        return render(request,'demo/noderegister.html',response)
        
class ConsensusView(generic.base.TemplateView):    
    template_name = 'demo/consensus.html'
    context_object_name = 'consensus_obj'

    def get(self,request,*args,**kwargs):
        replaced = blockchain.resolve_conflicts()
        if replaced:
            response = { 
                'message': 'Our chain was replaced',
                'chainlength': len(blockchain.chain),
                'chain': blockchain.chain
            }
        else:
            response = {
                'message': 'Our chain is authoritative',
                'chainlength': len(blockchain.chain),
                'chain': blockchain.chain,
            }

        return render(request,'demo/consensus.html',response)
    
    
    