import socketserver
import threading
import socket
import yaml
from cryptography.fernet import Fernet
import secrets
import base64
import datetime
#https://docs.python.org/3/library/socketserver.html#server-creation-notes


SERVER_NAME = "Authentication Server"

SERVER_HOST = "127.0.0.1"
SERVER_PORT = 55100
BUFFER_SIZE = 1024
MSG_KRB_USERID = 'MSG_KRB_USERID'
MSG_KRB_USERPWD = 'MSG_KRB_USERPASSWORD'
MSG_KRB_A = "MSG_KRB_A"
MSG_KRB_A_PRINT = "Kerberos protocol step 2.1 : to send Client/TGS Session Key from AS SERVER"
MSG_KRB_B = "MSG_KRB_B"
MSG_KRB_B_PRINT = "Kerberos protocol step 2.2 : to send Ticket-Granting-Ticket from AS SERVER"


class ThreadTCPRequestHandler(socketserver.BaseRequestHandler):

    def handle(self):
        # self.request
        
        print("Server is listening...")
        
        try:
            self.data = self.request.recv(1024).decode('utf-8')
            current_thread = threading.current_thread()
            
            print("Recieved from {}, Data :{}".format(current_thread.name,self.data))

            if self.data.find(MSG_KRB_USERID) >=0 :
                uid = self.data.split('=')
                if uid[1]:
                    sessionkey,token = self.checkUser(userid = uid[1])
                    if len(token) > 0:

                        #sent msessage A
                        print(MSG_KRB_A_PRINT)
                        self.request.sendall(self.krbmsgA(token))

                        #sent message B
                        print(MSG_KRB_B_PRINT)
                        self.krbmsgB(uid,token)
                        #self.request.sendall(self.krbmsgB())



            #self.request.sendall(token)
        except Exception as e:
            print(e)
            
    def finish(self):
        pass             
    def krbmsgA(self,token):
        return bytes("{}:{}".format(MSG_KRB_A,token),'utf-8')
    
    
    
    def krbmsgB(self,uid,token):        

        # TGT票据有效期10分钟
        expired = datetime.datetime.now()+datetime.timedelta(minutes=10)
        # 客户端网络地址
        u_ipaddr = self.request.raddr[0]
        # 打包消息B
        msgB = "uid:{},u_ipaddr:{},expired:{},clt_tgs_sk:{}".format(uid,u_ipaddr,expired,token)
        # 加密消息B
        key = Fernet.generate_key()
        f = Fernet(key)
        ##
        ##
        #TODO CHECK THIS.
        return f.encrypt(msgB.encode('utf-8'))




    def checkUser(self,userid):
        
        users = [
                    {"uid":"leo","pwd":"202cb962ac59075b964b07152d234b70"},
                    {"uid":"neo","pwd":"456"},
                ]
        
        for u in users:
            if u['uid'] == userid:
                # 使用用户的pwd hash为密钥生成会话密钥
                print("User {} login successfully.".format(userid))
                f = Fernet(base64.b64encode(u['pwd'].encode()))
                sessionkey = str(secrets.SystemRandom().getrandbits(128))
                token = f.encrypt(sessionkey.encode('utf-8'))
                return (str(sessionkey),token)
            else:
                print("Login failed. {} is not a legal user.".format(userid))
                return ()

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