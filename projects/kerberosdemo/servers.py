"""The file defines some tcp server class for building kerberos AS and SS

Some key concepts:
- AS: Kerberos Authentication Server
- SS: Kerberos Service Server
- KDC: Kerberos key distribution center.

Socket Server programming workflow: 
    socket(), bind(),listen(),accept()... 
    wait for connection ...
    recv()
    process request...
    send()

Socket Client programming workflow：
    connect()
    send()
    ...
    recv()    
https://www.techbeamers.com/python-tutorial-essentials-of-python-socket-programming/
"""

import socket
import datetime
import sys

class TCPServer():
    
    def __init__(self,name='tcpserver',host='localhost',port=55100):
        """
        To initialize socket and bind (ip,port)    
        """
        try:
            self.name = name
            self.s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
            self.s.bind((host,port))
            
        except socket.error as err_msg:
            print ('Unable to instantiate socket. Error code: ' 
                + str(err_msg[0]) + ' , Error message : ' + err_msg[1])
            sys.exit()
        
        print("An {} socket instance is created.".format(name))

    def listen(self):
        self.s.listen(1)
        print("Server {} is listening...".format(self.name))
        conn, addr = self.s.accept()
        print("Connection from: "+str(addr))

        while True:
            data = conn.recv(1024).decode()
            if not data:
                break
        
            print("Received from User:" + str(data))

            data = input(">>")
            conn.send(data.encode())

        conn.close()


if __name__ == "__main__":
    tcpserver = TCPServer()
    tcpserver.listen()

