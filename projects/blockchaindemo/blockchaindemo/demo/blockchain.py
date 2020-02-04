import time
import hashlib
import json
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import requests

class Blockchain(object):
    """The class Blockchain is responsible for managing the chain. It will 
    store transactions and have some helper methods for adding new blocks 
    to chain.
    """
    def __init__(self):
        self.chain = []
        self.current_transactions = []
        self.nodes = set()
        #新建一个创始区块，它没有任何前序区块。
        self.new_block(previous_hash = 1,proof=100)

    def new_block(self,previous_hash=None,proof=None):
        """To creates a new Block and adds it to the chain
        :param previous_hash: (optional) <str> Hash of previous Block
        :param proof: <int> The proof given by the Proof of Work algorithm
        :return: <dict> New Block
        """
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time.time(),
            'transactions': self.current_transactions,
            'proof': proof,
            'previous_hash': previous_hash or self.hash(self.chain[-1]),
        }
        
        #Reset the current list of transactions
        self.current_transactions = []

        self.chain.append(block)
        return block

    @staticmethod
    def hash(block):
        """To create a SHA-256 hash of a Block
        :param block: <dict> Block
        :return: <str>
        """

        # We must make sure that the Dictionary is Ordered, or we'll have inconsistent hashes
        block_string = json.dumps(block,sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def new_transaction(self,sender,recipient,amount):
        """
        To create a new transaction to go into the next mined Block.

        :param sender: <str> Address of the Sender
        :param recipient: <str> Address of the recipient
        :param amount: <int> Amount

        :return: <int> The index of the Block that will hold this transaction
        """
        self.current_transactions.append({
            'sender': sender,
            'recipient': recipient,
            'amount': amount,
        })
        #Returns  the index of the block which the transaction will be added 
        # to—the next one to be mined. This will be useful later on, 
        # to the user submitting the transaction.
        return self.last_block['index'] + 1 
    
    @property
    def last_block(self):
        return self.chain[-1]
    
    def proof_of_work(self,last_proof):
        """
        Simple Proof of Work Algorithm:
        - Find a number p' such that hash(pp') contains leading 4 zeroes, where p is the previous p'
        - p is the previous proof, and p' is the new proof
        :param last proof: <int>
        :return: <int>
        """
        proof = 0
        while self.valid_proof(last_proof,proof) is False:
            proof += 1

        return proof

    @staticmethod
    def valid_proof(last_proof,proof):
        """
        To validate the Proof: Does hash(last_proof,proof) contain 4 leading zeroes ?
        :param last_proof: <int> Previous Proof
        :param proof: <int> Current Proof
        :return: <bool> True if correct, False if not
        """

        guess = f'{last_proof}{proof}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == "0000"

    def regist_node(self,address):
        """
        Add a new node to the list of nodes
        :param address: <str> Address of node. Eg. 'http://192.1.1.3:4030'
        :return: None
        """
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.path)
        
    def valid_chain(self,chain):
        """
        Determine if a given blockchain is valid_chain
        :param chain: <list> A blockchain
        :return: <bool> True if valid, False if not
        """
        last_block = chain[0]
        current_index = 1
        while current_index < len(chain):
            block = chain[current_index]
            print(last_block)
            print(block)
            print('---'*3)
            #check that the hash of the block is correct
            if block['previous_hash'] != self.hash(last_block):
                return False
            
            #To check that the Proof of Work is correct
            if not self.valid_proof(last_block['proof'],block['porrf']):
                return False
            last_block = block
            current_index += 1
            
        return True
   
    def resolve_conflicts(self):
        """
        This is our Consensus Algorithm, it resolves conflicts 
        by replacing our chain with the longest one in the network. 
        :return: <bool> True if our chain was replaced, False if not. 
        """
        neighbors = self.nodes
        new_chain = None
        
        #We're only looking for chains longer than ours
        max_length = len(self.chain)
      
        #To grab and verify the chains from all the nodes in our network.
        
       
        for node in neighbors:  
            try:
                print("Try to access node: "+node+" ...")
                r = requests.get('http://{}/chain'.format(node),timeout=1)
                r.raise_for_status()
                #print(r.text)                
                bsobj = BeautifulSoup(r.text,'html.parser')                
                c = bsobj.find_all(id = 'block')
                chain = []
                for b in c:
                    block = eval( b.string )#不安全用法
                    chain.append(block)
                    
                length = int(bsobj.find("span",id="chainlength").string)
                           
                #To check if the length is longer and che chain is valid
                if length > max_length and self.valid_chain(chain):
                    max_length = length
                    new_chain = chain  
            except:
                print("Access " + node + " timeout!")   
                continue                
            #To replace our chain if we discovered a new, valid chain longer than ours
            if new_chain:
                self.chain = new_chain
                return True
            return False          
                
        