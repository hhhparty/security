import socketserver
import threading
import socket
import yaml
from cryptography.fernet import Fernet
import secrets

#https://docs.python.org/3/library/socketserver.html#server-creation-notes


SERVER_NAME = "Authentication Server"

SERVER_HOST = "127.0.0.1"
SERVER_PORT = 55100
BUFFER_SIZE = 1024
MSG_KRB_USERID = 'MSG_KRB_USERID'
MSG_KRB_USERPWD = 'MSG_KRB_USERPASSWORD'


class ThreadTCPRequestHandler(socketserver.BaseRequestHandler):

    def handle(self):
        # self.request
        
        print("Server is listening...")
        
        try:
            self.data = self.request.recv(1024).decode('utf-8')
            current_thread = threading.current_thread()
            response = bytes("{}:{}".format(current_thread.name,self.data),'utf-8')
            print("Recieved from {}, Data :{}".format(current_thread.name,self.data))

            if self.data.find(MSG_KRB_USERID) >=0 :
                uid = self.data.split('=')
                if uid[1]:
                    sessionkey,token = self.checkUser(userid = uid[1])
                    print(sessionkey)
                    print(token)

            self.request.sendall(response)
        except Exception as e:
            print(e)
            
    def finish(self):
        pass             


    def checkUser(self,userid):
        users = [
                    {"uid":"leo","pwd":"a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"},
                    {"uid":"neo","pwd":"456"},
                ]
        
        for u in users:
            if u['uid'] == userid:
                # 使用用户的pwd hash为密钥生成会话密钥
                f = Fernet(u['pwd'])
                sessionkey = secrets.SystemRandom().randint(1000000000,9999999999)
                token = f.encrypt(str(sessionkey))
                return (str(sessionkey),token)

        return ()


    
class AuthenticationServer(socketserver.ThreadingTCPServer):
    servertype = 'AUTHENTICATION_SERVER'

    







if __name__ == "__main__":

    while True:
        try:
            server = AuthenticationServer((SERVER_HOST,SERVER_PORT),ThreadTCPRequestHandler)

            # 单线程服务器、多线程request处理
            server.allow_reuse_address = True
            print("{} {} is starting...".format(server.servertype,server.server_address))
            server.serve_forever()
        except Exception as e:
            print(e)


    """
    #多线程服务器，多线程request处理
    with server:
        host,port = server.server_address
        # To start a thread with server -- that thread will then start one more thread for each request
        server_thread = threading.Thread(target=server.serve_forever)

        # To exit the server thread when the main thread terminates
        server_thread.daemon = True
        server_thread.start()
        print("Server loop running in thread:", server_thread.name)
        threads = []
    
        while True:       
            
            newthread = threading.Thread(target=server.serve_forever)
            newthread.start()
            threads.append(newthread)

        for t in threads:
            t.join()
        server.shutdown()
    """