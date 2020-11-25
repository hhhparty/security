import smtpd
import asyncore
import socket

class SimpleSMTPServer(smtpd.SMTPServer):
    """Naive SMTP Server"""
    def process_message(self,peer,mailfrom,mailto,data):
        print("Receiving message from: ",peer)
        print("Message addressed from: ", mailfrom)
        print("Message addressed to: ",mailto)
        print("Message length:",len(data))
        return
def getHostIp():
    try:
        s = socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
        s.connect(('8.8.8.8',80))
        ip = s.getsockname()[0]
    finally:
        s.close()
    print("Local IP Address:",ip)
    return ip 

server = SimpleSMTPServer((getHostIp(),25),None)
asyncore.loop()