from socketserver import BaseRequestHandler, TCPServer
import socket

class AuthServer1(BaseRequestHandler):
    def handle(self):
        print('Listening authentication request...')
        print('Got connection from {}'.format(self.client_address))
        while True:
            msg = self.request.recv(8192)
           
            if not msg:
                break
            self.request.send(msg)

class AuthServer2():
    def __init__(self,ip,port):
        self.ip = ip
        self.port = port
        self.s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        self.s.bind((self.ip,self.port))
        print("Start authentication server...")
        print("to listening authentication request in {}:{}...".format(self.ip,self.port))
        
        self.s.listen(10)
    def run(self):
        while True:
            (clientsocket,address) = self.s.accept()
            ct = client_thread(clientsocket)
            ct.run()

if __name__ == '__main__':
    #authserver = TCPServer(('',40001),AuthServer)
    #authserver.serve_forever()
    authserver =  AuthServer2('',40001) #s.bind(('', 80)) specifies that the socket is reachable by any address the machine happens to have.
    authserver.run()

    #todo https://docs.python.org/3/howto/sockets.html
    