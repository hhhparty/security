from socket import socket , AF_INET,SOCK_STREAM

class Client():
    def __init__(self,clientID,clientpwd):
        self.clientID = clientID
        self.clientpwd = clientpwd
        self.s = socket(AF_INET,SOCK_STREAM)
        

    def sendAuthRequest(self,authserver):      
        print('Start connect auth server : {} ...'.format(authserver))  
        try:
            self.s.connect(authserver)
            print('to send message {}'.format(self.clientID))
            self.s.send(b'AUTH_REQUEST')
            self.s.send(self.clientID.encode('utf-8'))
        except Exception as e:
            print(e)

    def login(self):
        self.clientID = input('Please input user id:')
        self.clientpwd = input("Please input user password:")

    

    def getRecv(self):
        self.s.recv(8192)
if __name__ == "__main__":
    c1 = Client('leo','123456')
    c1.sendAuthRequest(authserver=('localhost',40001))
    c1.getRecv()