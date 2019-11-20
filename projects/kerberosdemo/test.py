import yaml
import hashlib

import base64
import secrets
import os
from cryptography.fernet import Fernet
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC


def checkUser(userid):
        
        users = [
                    {"uid":"leo","pwd":"202cb962ac59075b964b07152d234b70"},
                    {"uid":"neo","pwd":"250cf8b51c773f3f8dc8b4be867a9a02"},
                ]
        
        for u in users:
            if u['uid'] == userid:
                # 使用用户的pwd hash为密钥生成会话密钥

                f = Fernet(base64.b64encode(u['pwd'].encode()))
                sessionkey = str(secrets.SystemRandom().getrandbits(128)).encode('utf-8')
                token = f.encrypt(sessionkey)
                return (str(sessionkey),token)

        return ()
        
def checkUser1(userid):
        
        users = [
                    {"uid":"leo","pwd":"202cb962ac59075b964b07152d234b70"},
                    {"uid":"neo","pwd":"250cf8b51c773f3f8dc8b4be867a9a02"},
                ]
        
        for u in users:
            if u['uid'] == userid:
                # 使用用户的pwd hash为密钥生成会话密钥

                password = u['pwd'].encode('utf-8')
                
                kdf = PBKDF2HMAC(
                        algorithm=hashes.MD5(),
                        length=32,
                        salt=bytes(),
                        iterations=100000,
                        backend=default_backend())
                key = base64.urlsafe_b64encode(kdf.derive(password))
                f = Fernet(key)

                sessionkey = str(secrets.SystemRandom().getrandbits(128)).encode('utf-8')
                token = f.encrypt(sessionkey)

                return (str(sessionkey),token)
        return ()

def decrypt1(secret):
        password = '456'.encode('utf-8')
                
        kdf = PBKDF2HMAC(
                algorithm=hashes.MD5(),
                length=32,
                salt=bytes(),
                iterations=100000,
                backend=default_backend())
        key = base64.urlsafe_b64encode(kdf.derive(password))
        f = Fernet(key)
        return f.decrypt(secrets)

def decrypt(keystr,secret):
    f = Fernet(base64.b64encode(keystr.encode('utf-8')))
    
    return f.decrypt(secret)


if __name__ == "__main__":
    #import os
    #os.getcwd()
    a = checkUser('neo')
    print("plain text")
    print(a[0])

    keystr = "250cf8b51c773f3f8dc8b4be867a9a02"
    print("decrypt result:")
    print(decrypt(keystr,a[1]))