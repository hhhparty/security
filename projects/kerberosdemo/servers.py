"""The file defines some tcp server class for building kerberos AS and SS

Some key concepts:
- AS: Kerberos Authentication Server
- SS: Kerberos Service Server
- KDC: Kerberos key distribution center.

Note that a server must perform the sequence socket(), bind(), listen(), accept() (possibly 
repeating the accept() to service more than one client), while a client only needs the 
sequence socket(), connect(). 
Also note that the server does not sendall()/recv() on the socket it is listening on but 
on the new socket returned by accept().


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
from threading import Thread
from socketserver import ThreadingMixIn

#
SERVER_HOST = "127.0.0.1"
SERVER_PORT = 55100
SERVER_BUFFER_SIZE = 1024

class TCPServer():
    
    def __init__(self,name='tcpserver',host='localhost',port=55100):
        """
        To initialize socket and bind (ip,port)    
        """
        try:
            self.name = name
            self.s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
            self.s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1) 
            self.s.bind((host,port))
            
        except socket.error as err_msg:
            print ('Unable to instantiate socket. Error code: ' 
                + str(err_msg[0]) + ' , Error message : ' + err_msg[1])
            sys.exit()
        
        print("An {} socket instance is created.".format(name))

    def listen(self,queuesnum = 5):
        self.s.listen(1)
        print("Server {} is listening...".format(self.name))
        print("Multithreaded Python server : Waiting for connections from TCP clients...")
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

class ClientThread(Thread):
    """Multithreaded python server : TCP Server Thread Pool"""

    def __init__(self,host,port):
        Thread.__init__(self)
        self.host = host
        self.port = port
        print("[+] New server socket thread started for "+host+":"+str(port))

    def run(self):
        while True:
            data = conn.recv(2048)
            print("Server recieved: ", data)
            msg = input("Multithread Python Server : Enter Response from Server/Enter exit: ")
            if msg == "exit":
                break
            conn.send(msg)

def main():
    tcpserver = TCPServer(name="Authentication Server in Kerberos")
    tcpserver.listen()    
    threads = []
    
    while True:       
        
        newthread = ClientThread(SERVER_HOST,SERVER_PORT)
        newthread.start()
        threads.append(newthread)

    for t in threads:
        t.join()


if __name__ == "__main__":
    main()

