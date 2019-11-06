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
    def __init__(self,host='localhost',port=50007):
        self.host = host
        self.port = port
        with socket.socket(socket.AF_INET,socket.SOCK_STREAM) as s:
            s.bind(self.host,self.port)
            print("Start authentication server...")
            print("to listening authentication request in {}:{}...".format(self.host,self.port))
            self.s = s
            self.s.listen(10)
    def run(self):
        while True:
            (conn,address) = self.s.accept()
            print("Connected by {} .".format(address))
            data = conn.recv(1024)
            #if not data:
            #    break
            conn.sendall(data)

if __name__ == '__main__':
    #authserver = TCPServer(('',40001),AuthServer)
    #authserver.serve_forever()
    authserver =  AuthServer2() #s.bind(('', 80)) specifies that the socket is reachable by any address the machine happens to have.
    authserver.run()

    #todo https://docs.python.org/3/howto/sockets.html
    