import socket
import sys
import hashlib

class TCPClient():
    def __init__(self,name='tcpclient',host='localhost',port=55100):
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

        msg = input(">>")

        while msg != "q":
            self.s.send(msg.encode())
            data = self.s.recv(1024).decode()

            print('Received from server: '+ data)
            msg = input(">>")
        self.s.close()
    
    def login(self):
        uid = input("User ID:")
        pwd = input("User password:")
        loginstr = "uid="+uid
        
        print("Kerberos protocol step 1: to send uid to AS SERVER with the plain text: {}".format(uid))
        self.s.send(loginstr.encode())

        pwdhc = hashlib.sha256(pwd.encode())
        print("The pwd sha256 hashcode is ",pwdhc.hexdigest())

if __name__ == '__main__':
    client = TCPClient()
    #
    client.login()
    client.run()
