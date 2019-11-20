import socket
import sys
import hashlib
import os
from cryptography.fernet import Fernet
import base64
#
SERVER_HOST = "127.0.0.1"
SERVER_PORT = 55100
BUFFER_SIZE = 1024
MSG_KRB_USERID = 'MSG_KRB_USERID'
MSG_KRB_USERPWD = 'MSG_KRB_USERPASSWORD'
MSG_KRB_A = "MSG_KRB_A"

KRBMESSAGES = [MSG_KRB_USERID,MSG_KRB_USERPWD,MSG_KRB_A]

class TCPClient():
    def __init__(self,name='tcpclient_1',host='localhost',port=55100):
        """
        To initialize socket client 
        """
        try:
            self.name = name
            self.s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
            print("The tcp client {} begin to connect server {}:{}...".format(name,host,port))
            self.s.connect((host,port))
        except ConnectionError as err_msg:
            print ('Unable to connect server. ' + str(err_msg))
            sys.exit()

        print("connect successfully.")

    def run(self):
        msg = input(self.name + ">>")
        while msg.upper() not in ["QUIT","EXIT"]:
            self.s.send(msg.encode())
            data = self.s.recv(BUFFER_SIZE).decode()            
            print('Received from server: '+ data)
            if data.split(":")[0] in KRBMESSAGES:
                print("ok")
                

            msg = input((self.name + ">>"))

        self.s.close()

    def login(self):
        uid = input("User ID:")
        pwd = input("User password:")
        loginstr = MSG_KRB_USERID +"=" + uid
        
        print("Kerberos protocol step 1: to send uid to AS SERVER with the plain text: {}".format(uid))
        self.s.send(loginstr.encode('utf-8'))

        pwdhc = hashlib.md5(pwd.encode('utf-8'))
        print("The pwd md5 hashcode is ",pwdhc.hexdigest())

    def decrypt(self,keystr,secret):
        """To decrypt the secret ( session key ) with keystr, which is user's password hashcode
        """
        f = Fernet(base64.b64encode(keystr.encode('utf-8')))

        return f.decrypt(secret)

if __name__ == '__main__':
    client = TCPClient(name="tcpclient_1")
    client.login()
    client.run()