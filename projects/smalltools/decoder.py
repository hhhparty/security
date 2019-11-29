import base64

def base64decode(filename):
    # ['A', 'B', 'C', ... 'a', 'b', 'c', ... '0', '1', ... '+', '/']
    with open(filename,'r') as f:
        for r in f.readline():
            print(r)
            #print( base64.b64decode(r))
          

base64decode(filename='projects\\smalltools\\needdecodetxt.txt')